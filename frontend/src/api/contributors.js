import api from './client.js';

export async function searchContributors(query = '') {
  const { data } = await api.get('/contributors', { params: { search: query } });
  return data.contributors;
}

export async function fetchContributorProfile(username) {
  const { data } = await api.get(`/contributors/${username}`);
  return data;
}

export async function fetchContributorRecentPrs(username) {
  const { data } = await api.get(`/contributors/${username}/recent-prs`);
  return data.prs;
}
