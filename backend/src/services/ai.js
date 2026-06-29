// PATH: pr-intel/backend/src/services/ai.js

import { routePrompt } from './aiRouter.js';
import { matchRelatedDocs } from './kb.js';
import { searchIndex } from '../utils/rag/bm25.js';
import { annotatePrTerms } from '../utils/dictionary.js';

// ── RAG retrieval ──────────────────────────────────────────────────────────

function retrieveContext(title, labels = [], topK = 6) {
  const labelStr = labels
    .map((l) => (typeof l === 'string' ? l : l.name))
    .join(' ');
  const query = `${title} ${labelStr}`.trim();
  const hits = searchIndex(query, topK);
  if (hits.length === 0) return null;

  return hits
    .map(
      (chunk, i) =>
        `[Context ${i + 1}] PR #${chunk.number}: "${chunk.title}"
  Labels: ${(chunk.labels || []).join(', ') || 'none'}
  Files:  ${(chunk.files || []).slice(0, 5).join(', ') || 'unknown'}
  Body:   ${(chunk.body || '').slice(0, 280)}`
    )
    .join('\n\n');
}

// ── Prompt builder ─────────────────────────────────────────────────────────

function buildPrompt({ title, body, files, labels }, contextBlock) {
  const fileList = files
    .slice(0, 15)
    .map(
      (f) =>
        `  ${f.status.padEnd(8)} ${f.filename}  (+${f.additions} / -${f.deletions})`
    )
    .join('\n');

  const labelNames = labels
    .map((l) => (typeof l === 'string' ? l : l.name))
    .join(', ') || 'none';

  const annotatedBody = annotatePrTerms((body || '').slice(0, 1500));

  const contextSection = contextBlock
    ? `RELATED ROCKET.CHAT PRS — cite these as [Context N] when they apply:
${contextBlock}

`
    : '';

  return `You are a senior Rocket.Chat contributor helping a first-year CS student understand open source pull requests.

${contextSection}RULES:
- Answer using ONLY the PR data below and the context chunks above.
- For every factual claim about RC architecture, cite the [Context N] number.
- Do not use outside knowledge not present in the context.
- Reply ONLY with a valid JSON object — no markdown, no backticks, no extra text.

TITLE: ${title}
LABELS: ${labelNames}

DESCRIPTION:
${annotatedBody}

FILES CHANGED:
${fileList}

JSON schema (fill every field):
{
  "oneLiner": "One crisp sentence: what this PR does",
  "summary": "2-3 sentences plain English explanation",
  "problemSolved": "What bug, limitation, or request this addresses",
  "technicalDetails": "Key technical change — module, function, or pattern. Cite [Context N] if used.",
  "whatToLearn": "Most valuable concept for a junior dev to study after reading this",
  "similarContribution": "How a junior dev could contribute something similar",
  "difficulty": "beginner | intermediate | advanced",
  "type": "bugfix | feature | refactor | docs | test | performance | chore",
  "contextUsed": ["list [Context N] labels used, or empty array"]
}`;
}

// ── Response parser ────────────────────────────────────────────────────────

function parseResponse(raw, fallbackTitle) {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch { /* fall through */ }

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch { /* fall through */ }
  }

  return {
    oneLiner: fallbackTitle,
    summary: 'Parse error — AI returned malformed JSON.',
    problemSolved: '',
    technicalDetails: '',
    whatToLearn: '',
    similarContribution: '',
    difficulty: 'intermediate',
    type: 'chore',
    contextUsed: [],
  };
}

// ── Judge heuristic (until full judge agent is built) ─────────────────────

function judgeScore(summary, ragHits) {
  let score = 7;
  if (ragHits > 0) score += 1;
  if (summary.contextUsed?.length > 0) score += 1;
  if (summary.difficulty === 'beginner') score += 1;
  return Math.min(score, 15);
}

// ── Main export ────────────────────────────────────────────────────────────

export async function summarizePR({ title, body, files, labels }) {
  const contextBlock = retrieveContext(title, labels);
  const ragHits = contextBlock ? (contextBlock.match(/\[Context/g) || []).length : 0;

  console.log(
    ragHits > 0
      ? `[ai] RAG: ${ragHits} chunks injected for "${title}"`
      : `[ai] RAG: no chunks — answering without grounding`
  );

  const prompt = buildPrompt({ title, body, files, labels }, contextBlock);
  const { text, provider } = await routePrompt(prompt);
  console.log('[ai] Raw response:', text.slice(0, 500));  //error debugging
  const summary = parseResponse(text, title);

  summary._provider = provider;
  summary._ragHits = ragHits;
  summary.judgeScore = judgeScore(summary, ragHits);
  summary.relatedDocs = await matchRelatedDocs({ title, body, labels });

  return summary;
}