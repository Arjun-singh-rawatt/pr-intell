import mongoose from 'mongoose';
import { REPO } from '../services/github.js';

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    value: { type: Number, required: true, min: 1, max: 10 },
  },
  { _id: false }
);

const explanationSchema = new mongoose.Schema(
  {
    prNumber: { type: Number, required: true, index: true },
    repo: { type: String, default: REPO },
    content: { type: String, required: true },
    generatedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: undefined },
      username: { type: String, default: undefined },
    },
    provider: { type: String, default: '' },
    ratings: { type: [ratingSchema], default: [] },
    score: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

explanationSchema.index(
  { prNumber: 1, repo: 1, 'generatedBy.userId': 1 },
  {
    unique: true,
    partialFilterExpression: { 'generatedBy.userId': { $exists: true } },
  }
);

export default mongoose.model('Explanation', explanationSchema);
