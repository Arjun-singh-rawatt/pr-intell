import express from 'express';
import jwt from 'jsonwebtoken';
import Explanation from '../models/Explanation.js';
import User from '../models/User.js';
import { requireAuth, SESSION_COOKIE } from '../middleware/requireAuth.js';
import { getPRDetail, REPO } from '../services/github.js';
import { summarizePR } from '../services/ai.js';

const router = express.Router({ mergeParams: true });

function parsePrNumber(value) {
  const prNumber = Number.parseInt(value, 10);
  return Number.isNaN(prNumber) ? null : prNumber;
}

function buildExplanationContent(summary) {
  const sections = [
    summary?.oneLiner?.trim(),
    summary?.summary ? `Summary\n${summary.summary.trim()}` : '',
    summary?.problemSolved ? `Problem Solved\n${summary.problemSolved.trim()}` : '',
    summary?.technicalDetails ? `Technical Details\n${summary.technicalDetails.trim()}` : '',
    summary?.whatToLearn ? `What To Learn\n${summary.whatToLearn.trim()}` : '',
    summary?.similarContribution ? `Similar Contribution\n${summary.similarContribution.trim()}` : '',
  ];

  return sections.filter(Boolean).join('\n\n');
}

function recomputeRatingFields(explanation) {
  const ratingCount = explanation.ratings.length;
  const total = explanation.ratings.reduce((sum, item) => sum + item.value, 0);
  explanation.ratingCount = ratingCount;
  explanation.score = ratingCount > 0 ? Number((total / ratingCount).toFixed(1)) : 0;
}

function getCurrentUserRating(explanation, userId) {
  const currentUserId = userId?.toString();
  if (!currentUserId) return null;

  const record = explanation.ratings.find((item) => item.userId.toString() === currentUserId);
  return record ? record.value : null;
}

function serializeExplanation(explanation, userId) {
  const generatedByUserId = explanation.generatedBy?.userId
    ? explanation.generatedBy.userId.toString()
    : null;

  const payload = {
    id: explanation._id.toString(),
    prNumber: explanation.prNumber,
    repo: explanation.repo,
    content: explanation.content,
    generatedBy: {
      userId: generatedByUserId,
      username: explanation.generatedBy?.username || '',
    },
    provider: explanation.provider || '',
    score: explanation.score,
    ratingCount: explanation.ratingCount || 0,
    createdAt: explanation.createdAt,
    updatedAt: explanation.updatedAt,
  };

  if (userId) {
    payload.currentUserRating = getCurrentUserRating(explanation, userId);
  }

  return payload;
}

async function getOptionalUser(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.SESSION_SECRET);
    return await User.findById(payload.userId);
  } catch {
    return null;
  }
}

router.get('/', async (req, res) => {
  try {
    const prNumber = parsePrNumber(req.params.number);
    if (prNumber == null) {
      return res.status(400).json({ error: 'Invalid pull request number' });
    }

    const user = await getOptionalUser(req);
    const explanations = await Explanation.find({ prNumber, repo: REPO })
      .sort({ score: -1, ratingCount: -1, createdAt: -1 });

    res.json(explanations.map((item) => serializeExplanation(item, user?._id)));
  } catch (err) {
    console.error(`[GET /api/prs/${req.params.number}/explanations]`, err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const prNumber = parsePrNumber(req.params.number);
    if (prNumber == null) {
      return res.status(400).json({ error: 'Invalid pull request number' });
    }

    const existing = await Explanation.findOne({
      prNumber,
      repo: REPO,
      'generatedBy.userId': req.user._id,
    });

    if (existing) {
      return res.status(409).json({ error: 'Current database is not capable enough.' });
    }

    const { pr, files, comments } = await getPRDetail(prNumber);
    const summary = await summarizePR({
      title: pr.title,
      body: pr.body,
      files,
      labels: pr.labels,
      comments,
    });

    const explanation = await Explanation.create({
      prNumber,
      content: buildExplanationContent(summary),
      generatedBy: {
        userId: req.user._id,
        username: req.user.username,
      },
      provider: summary?._provider || '',
    });

    res.status(201).json(serializeExplanation(explanation, req.user._id));
  } catch (err) {
    console.error(`[POST /api/prs/${req.params.number}/explanations]`, err.message);
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Current database is not capable enough.' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.post('/:explanationId/rate', requireAuth, async (req, res) => {
  try {
    const prNumber = parsePrNumber(req.params.number);
    if (prNumber == null) {
      return res.status(400).json({ error: 'Invalid pull request number' });
    }

    const rating = Number.parseInt(req.body?.rating, 10);
    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'rating must be a whole number from 1 to 10' });
    }

    const explanation = await Explanation.findOne({
      _id: req.params.explanationId,
      prNumber,
      repo: REPO,
    });

    if (!explanation) {
      return res.status(404).json({ error: 'Explanation not found' });
    }

    const currentUserId = req.user._id.toString();
    const existingRatingIndex = explanation.ratings.findIndex(
      (item) => item.userId.toString() === currentUserId
    );

    if (existingRatingIndex >= 0) {
      explanation.ratings[existingRatingIndex].value = rating;
    } else {
      explanation.ratings.push({ userId: req.user._id, value: rating });
    }

    recomputeRatingFields(explanation);
    await explanation.save();

    res.json(serializeExplanation(explanation, req.user._id));
  } catch (err) {
    console.error(
      `[POST /api/prs/${req.params.number}/explanations/${req.params.explanationId}/rate]`,
      err.message
    );
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:explanationId', requireAuth, async (req, res) => {
  try {
    const prNumber = parsePrNumber(req.params.number);
    if (prNumber == null) {
      return res.status(400).json({ error: 'Invalid pull request number' });
    }

    const explanation = await Explanation.findOne({
      _id: req.params.explanationId,
      prNumber,
      repo: REPO,
    });

    if (!explanation) {
      return res.status(404).json({ error: 'Explanation not found' });
    }

    if (!explanation.generatedBy?.userId || explanation.generatedBy.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own explanations' });
    }

    await explanation.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    console.error(`[DELETE /api/prs/${req.params.number}/explanations/${req.params.explanationId}]`, err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
