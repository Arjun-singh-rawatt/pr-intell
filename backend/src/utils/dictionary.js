const PROFESSIONAL_DICTIONARY = {
  regression: "A bug introduced by a code change that breaks previously working functionality",
  chore: "Maintenance task with no user-facing change (dependency updates, config changes, cleanup)",
  refactor: "Code restructuring that improves design without changing external behavior",
  lint: "Automated code style and formatting enforcement",
  ci: "Continuous Integration — automated build and test pipeline triggered on every commit",
  cd: "Continuous Deployment — automated release of passing builds to production",
  hotfix: "Emergency patch for a critical bug in production",
  deprecate: "Mark a feature or API as obsolete, scheduled for future removal",
  "breaking change": "A change that is not backward compatible — existing integrations may stop working",
  migration: "Moving data, code, or configuration from one format/system to another",
  typescript: "Statically typed superset of JavaScript used throughout Rocket.Chat's codebase",
  monorepo: "Single repository containing multiple related packages/apps (Rocket.Chat's structure)",
  pr: "Pull Request — a proposed code change submitted for review before merging",
  merge: "Integrating a branch's changes into the main codebase",
  revert: "Undoing a previous commit or merge",
  patch: "A small fix, usually for a specific bug, often without new features",
  semver: "Semantic Versioning (MAJOR.MINOR.PATCH) — the versioning system Rocket.Chat uses",
  e2e: "End-to-End test — automated test simulating real user behavior across the full stack",
  "unit test": "Test of a single function or module in isolation",
  "integration test": "Test verifying multiple components work together correctly",
  stale: "An issue or PR with no recent activity, often auto-closed by bots",
  wip: "Work In Progress — incomplete, not ready for review",
  draft: "Pull request explicitly marked as not ready for merge",
  squash: "Combining multiple commits into one before merging",
  rebase: "Replaying commits on top of another branch to keep linear history",
  doc: "Documentation — written explanation of code, APIs, or features",
  livechat: "Rocket.Chat's customer support / omnichannel messaging module",
  omnichannel: "Multi-channel customer communication (email, SMS, WhatsApp, live chat) unified in Rocket.Chat",
  fuselage: "Rocket.Chat's open-source React UI component design system",
  "apps-engine": "Rocket.Chat's plugin/extension system allowing third-party app integration",
  federation: "Feature allowing different Rocket.Chat servers to communicate with each other",
  meteor: "The full-stack JavaScript framework Rocket.Chat was originally built on (still core backend)"
};

export function annotatePrTerms(prText) {
  let annotated = prText;
  // Sort terms by length descending to avoid short terms breaking multi-word matching (e.g., 'unit test' vs 'test')
  const sortedTerms = Object.keys(PROFESSIONAL_DICTIONARY).sort((a, b) => b.length - a.length);
  
  sortedTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    annotated = annotated.replace(regex, (match) => `${match} [Def: ${PROFESSIONAL_DICTIONARY[term.toLowerCase()]}]`);
  });
  
  return annotated;
}