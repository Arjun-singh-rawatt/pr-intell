import { isConfiguredEnv } from '../utils/env.js';

const BASE = 'https://api.github.com';
export const REPO = 'RocketChat/Rocket.Chat';

function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (isConfiguredEnv('GITHUB_TOKEN')) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN.trim()}`;
  }
  return headers;
}

async function githubFetch(url) {
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getMergedPRs(page = 1, perPage = 20) {
  const url = `${BASE}/repos/${REPO}/pulls?state=closed&sort=updated&direction=desc&per_page=${perPage}&page=${page}`;
  const prs = await githubFetch(url);
  return prs.filter(pr => pr.merged_at !== null).map(pr => ({
    number: pr.number,
    title: pr.title,
    body: pr.body,
    state: pr.state,
    merged_at: pr.merged_at,
    created_at: pr.created_at,
    user: {
      login: pr.user.login,
      avatar_url: pr.user.avatar_url,
      html_url: pr.user.html_url,
    },
    labels: pr.labels.map(l => ({ name: l.name, color: l.color })),
    html_url: pr.html_url,
    additions: pr.additions,
    deletions: pr.deletions,
    changed_files: pr.changed_files,
    comments: pr.comments,
    review_comments: pr.review_comments,
  }));
}

function mapSearchItemToPR(item) {
  const user = item.user || {};
  return {
    number: item.number,
    title: item.title,
    body: item.body,
    state: item.state,
    merged_at: item.pull_request?.merged_at || item.closed_at,
    created_at: item.created_at,
    user: {
      login: user.login,
      avatar_url: user.avatar_url,
      html_url: user.html_url,
    },
    labels: (item.labels || []).map((l) => ({ name: l.name, color: l.color })),
    html_url: item.html_url,
    additions: 0,
    deletions: 0,
    changed_files: 0,
    comments: item.comments,
    review_comments: 0,
  };
}

export async function searchMergedPRs(query, perPage = 30) {
  const q = `repo:${REPO} is:pr is:merged ${query}`.trim();
  const url = `${BASE}/search/issues?q=${encodeURIComponent(q)}&per_page=${perPage}&sort=updated`;
  const data = await githubFetch(url);
  return (data.items || [])
    .filter((item) => item.pull_request)
    .map(mapSearchItemToPR);
}

export async function listRepoContributors() {
  const url = `${BASE}/repos/${REPO}/contributors?per_page=100`;
  const contributors = await githubFetch(url);
  return contributors.map((c) => ({
    login: c.login,
    avatar_url: c.avatar_url,
    html_url: c.html_url,
    contributions: c.contributions,
  }));
}

export async function searchContributors(query = '') {
  const contributors = await listRepoContributors();
  const q = query.trim().toLowerCase();
  if (!q) return contributors.slice(0, 50);
  return contributors.filter((c) => c.login.toLowerCase().includes(q));
}

export async function getContributorProfile(username) {
  const user = await githubFetch(`${BASE}/users/${username}`);
  const recentPrs = await getContributorRecentPRs(username, 8);
  return {
    login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
    html_url: user.html_url,
    bio: user.bio,
    public_repos: user.public_repos,
    followers: user.followers,
    recentPrs,
    prCount: recentPrs.length,
  };
}

export async function getContributorRecentPRs(username, perPage = 10) {
  const q = `repo:${REPO} is:pr is:merged author:${username}`;
  const url = `${BASE}/search/issues?q=${encodeURIComponent(q)}&per_page=${perPage}&sort=updated`;
  const data = await githubFetch(url);
  return (data.items || []).filter((item) => item.pull_request).map(mapSearchItemToPR);
}

export async function getPRDetail(prNumber) {
  const [pr, files, comments] = await Promise.all([
    githubFetch(`${BASE}/repos/${REPO}/pulls/${prNumber}`),
    githubFetch(`${BASE}/repos/${REPO}/pulls/${prNumber}/files?per_page=30`),
    githubFetch(`${BASE}/repos/${REPO}/issues/${prNumber}/comments?per_page=10`),
  ]);

  return {
    pr: {
      number: pr.number,
      title: pr.title,
      body: pr.body,
      merged_at: pr.merged_at,
      user: { login: pr.user.login, avatar_url: pr.user.avatar_url },
      labels: pr.labels.map(l => ({ name: l.name, color: l.color })),
      html_url: pr.html_url,
      additions: pr.additions,
      deletions: pr.deletions,
      changed_files: pr.changed_files,
    },
    files: files.slice(0, 20).map(f => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch?.slice(0, 500) || '',
    })),
    comments: comments.slice(0, 5).map(c => ({
      user: c.user.login,
      body: c.body?.slice(0, 300),
    })),
  };
}
