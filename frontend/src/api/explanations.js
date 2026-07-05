import api from './client.js';

export async function fetchExplanations(prNumber) {
  const { data } = await api.get(`/prs/${prNumber}/explanations`);
  return data;
}

export async function generateExplanation(prNumber) {
  const { data } = await api.post(`/prs/${prNumber}/explanations`, {});
  return data;
}

export async function rateExplanation(prNumber, explanationId, rating) {
  const { data } = await api.post(`/prs/${prNumber}/explanations/${explanationId}/rate`, { rating });
  return data;
}

export async function deleteExplanation(prNumber, explanationId) {
  const { data } = await api.delete(`/prs/${prNumber}/explanations/${explanationId}`);
  return data;
}
