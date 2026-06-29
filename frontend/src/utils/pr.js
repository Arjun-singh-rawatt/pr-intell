const TYPE_META = {
  bugfix: {
    label: 'Bug fix',
    pill: 'bg-warn/10 text-warn border-warn/30',
  },
  feature: {
    label: 'Feature',
    pill: 'bg-violet/10 text-violet border-violet/30',
  },
  refactor: {
    label: 'Refactor',
    pill: 'bg-blue/10 text-blue border-blue/30',
  },
  docs: {
    label: 'Docs',
    pill: 'bg-panel2 text-soft border-line',
  },
  test: {
    label: 'Test',
    pill: 'bg-success/10 text-success border-success/30',
  },
  performance: {
    label: 'Performance',
    pill: 'bg-accent/10 text-accent border-accent/30',
  },
  chore: {
    label: 'Chore',
    pill: 'bg-panel2 text-soft border-line',
  },
  beginner: {
    label: 'Beginner friendly',
    pill: 'bg-blue/10 text-blue border-blue/30',
  },
};

export const FEED_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'beginner', label: 'Beginner friendly' },
  { id: 'bugfix', label: 'Bug fixes' },
  { id: 'feature', label: 'Features' },
  { id: 'refactor', label: 'Refactors' },
  { id: 'docs', label: 'Docs' },
];

export function isBeginnerFriendly(pr, summary) {
  if (summary?.beginnerFriendly || summary?.type === 'beginner') {
    return true;
  }

  const haystack = [
    pr?.title || '',
    pr?.body || '',
    ...(pr?.labels || []).map((label) => label.name),
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes('beginner')
    || haystack.includes('good first')
    || haystack.includes('starter');
}

export function inferPRType(pr, summary) {
  if (summary?.type && TYPE_META[summary.type]) {
    return summary.type;
  }

  const haystack = [
    pr?.title || '',
    pr?.body || '',
    ...(pr?.labels || []).map((label) => label.name),
  ]
    .join(' ')
    .toLowerCase();

  if (haystack.includes('fix') || haystack.includes('bug')) return 'bugfix';
  if (haystack.includes('feature') || haystack.includes('enhancement')) return 'feature';
  if (haystack.includes('refactor')) return 'refactor';
  if (haystack.includes('doc')) return 'docs';
  if (haystack.includes('test')) return 'test';
  if (haystack.includes('performance') || haystack.includes('perf')) return 'performance';

  return 'chore';
}

export function getTypeMeta(type) {
  return TYPE_META[type] || TYPE_META.chore;
}

export function summarizeLabels(pr) {
  return (pr?.labels || []).slice(0, 3);
}

export function getContributorKey(pr) {
  return pr?.user?.login || 'unknown';
}

export function uniqueByNumber(items) {
  const map = new Map();

  items.forEach((item) => {
    if (item?.number != null) {
      map.set(item.number, item);
    }
  });

  return Array.from(map.values());
}
