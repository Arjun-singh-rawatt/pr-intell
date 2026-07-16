import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { searchContributors as fetchContributorsApi } from '../api/contributors.js';
import { searchKb } from '../api/kb.js';
import { useSearchParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext.jsx';
import { useDrawerPR } from '../hooks/useDrawerPR.js';
import { inferPRType, uniqueByNumber } from '../utils/pr.js';
import {
  ArrowDownUpIcon,
  BookIcon,
  BookmarkIcon,
  SearchIcon,
  SparklesIcon,
  UsersIcon,
  WarningIcon,
  RefreshIcon,
} from '../components/common/Icons.jsx';
import { Button, EmptyState, Panel, Pill, SectionHeading, TextInput, cn } from '../components/common/UI.jsx';
import PRCard from '../components/pr/PRCard.jsx';

const SEARCH_FILTERS = [
  { id: 'all', label: 'All Types' },
  { id: 'pr', label: 'Pull Requests' },
  { id: 'contributors', label: 'Contributors' },
  { id: 'kb', label: 'KB Docs' },
  { id: 'ai', label: 'AI Explanations' },
];

/**
 * ⚠️  SEARCH FILTERS - IMPLEMENTATION STATUS
 * 
 * ✅ IMPLEMENTED:
 *   - 'all': Shows all search results across all types
 *   - 'pr': Pull request title/description search (line 70+)
 *   - 'ai': AI summary content search (line 118+)
 * 
 * ❌ NOT FULLY IMPLEMENTED (Local fallback only, no backend):
 *   - 'contributors': Builds contributor index from feed items locally (line 83-105)
 *     TODO: Requires GET /api/contributors with global search
 *     TODO: Should return contributor profiles, not just aggregate from PRs
 *   
 *   - 'kb': Searches summaries for KB documents (line 108+)
 *     TODO: Requires GET /api/kb/documents endpoint
 *     TODO: KB documents currently only linked from AI summaries
 *     TODO: No standalone KB search capability
 * 
 * MIGRATION NEEDED:
 *   1. Implement backend endpoints for contributors and KB searches
 *   2. Add pagination for large result sets
 *   3. Improve search ranking/relevance
 *   4. Add advanced filters (date range, PR type, difficulty)
 */

export default function SearchPage() {
  const {
    feedItems,
    hasMore,
    loadMore,
    loadingMore,
    savedList,
    summaryCache,
    toggleSaved,
    toggleKbSaved,
    toggleContributorSaved,
    isSaved,
    isKbSaved,
    isContributorSaved,
  } = useAppData();
  const { openPR } = useDrawerPR();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeType, setActiveType] = useState('all');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const layoutRef = useRef(null);
  const resizeMetaRef = useRef({ startX: 0, startWidth: 320 });

  const allKnownPRs = useMemo(() => {
    const savedPRs = savedList.map((item) => item.pr);
    return uniqueByNumber([...feedItems, ...savedPRs]);
  }, [feedItems, savedList]);

  const prResults = useMemo(() => {
    if (!deferredQuery) return allKnownPRs;

    return allKnownPRs.filter((pr) => {
      const type = inferPRType(pr, summaryCache[pr.number]);
      return (
        pr.title.toLowerCase().includes(deferredQuery)
        || pr.user.login.toLowerCase().includes(deferredQuery)
        || (pr.body || '').toLowerCase().includes(deferredQuery)
        || type.includes(deferredQuery)
        || pr.labels.some((label) => label.name.toLowerCase().includes(deferredQuery))
      );
    });
  }, [allKnownPRs, deferredQuery, summaryCache]);

  const contributorResults = useMemo(() => {
    const map = new Map();

    prResults.forEach((pr) => {
      const key = pr.user.login;
      const record = map.get(key) || {
        login: pr.user.login,
        avatar_url: pr.user.avatar_url,
        matches: 0,
        prs: [],
      };

      record.matches += 1;
      record.prs.push(pr);
      map.set(key, record);
    });

    return Array.from(map.values()).sort((left, right) => right.matches - left.matches);
  }, [prResults]);

  const aiResults = useMemo(
    () =>
      Object.entries(summaryCache)
        .map(([number, summary]) => {
          const pr = allKnownPRs.find((item) => item.number === Number(number));
          return pr ? { pr, summary } : null;
        })
        .filter(Boolean)
        .filter(({ summary }) => {
          if (!deferredQuery) return true;
          return (
            summary.oneLiner?.toLowerCase().includes(deferredQuery)
            || summary.summary?.toLowerCase().includes(deferredQuery)
            || summary.whatToLearn?.toLowerCase().includes(deferredQuery)
          );
        }),
    [allKnownPRs, deferredQuery, summaryCache]
  );

  const [kbResults, setKbResults] = useState([]);
  const [remoteContributors, setRemoteContributors] = useState([]);

  useEffect(() => {
    if (!deferredQuery) {
      setKbResults([]);
      setRemoteContributors([]);
      return undefined;
    }

    let cancelled = false;
    Promise.all([
      searchKb(deferredQuery).catch(() => []),
      fetchContributorsApi(deferredQuery).catch(() => []),
    ]).then(([kb, contributors]) => {
      if (!cancelled) {
        setKbResults(kb);
        setRemoteContributors(contributors);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery]);

  useEffect(() => {
    if (!isResizing) return undefined;

    const handlePointerMove = (event) => {
      const container = layoutRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const delta = resizeMetaRef.current.startX - event.clientX;
      const minWidth = 280;
      const maxWidth = Math.max(minWidth, rect.width - 420);
      const nextWidth = resizeMetaRef.current.startWidth + delta;

      setSidebarWidth(Math.min(Math.max(nextWidth, minWidth), maxWidth));
    };

    const handlePointerUp = () => {
      setIsResizing(false);
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
    };
  }, [isResizing]);

  const mergedContributorResults = useMemo(() => {
    if (!remoteContributors.length) return contributorResults;
    const localLogins = new Set(contributorResults.map((c) => c.login));
    const extras = remoteContributors
      .filter((c) => !localLogins.has(c.login))
      .map((c) => ({
        login: c.login,
        avatar_url: c.avatar_url,
        matches: c.contributions || 0,
        prs: [],
      }));
    return [...contributorResults, ...extras];
  }, [contributorResults, remoteContributors]);

  const topLabels = useMemo(() => {
    const counts = new Map();
    prResults.forEach((pr) => {
      pr.labels.forEach((label) => {
        counts.set(label.name, (counts.get(label.name) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4);
  }, [prResults]);

  const visibleSections = useMemo(() => {
    if (activeType === 'all') {
      return {
        prs: prResults,
        contributors: mergedContributorResults,
        kb: kbResults,
        ai: aiResults,
      };
    }

    return {
      prs: activeType === 'pr' ? prResults : [],
      contributors: activeType === 'contributors' ? mergedContributorResults : [],
      kb: activeType === 'kb' ? kbResults : [],
      ai: activeType === 'ai' ? aiResults : [],
    };
  }, [activeType, aiResults, kbResults, mergedContributorResults, prResults]);

  const submitSearch = () => {
    const next = new URLSearchParams(searchParams);
    if (query.trim()) {
      next.set('q', query.trim());
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  const startSidebarResize = (event) => {
    resizeMetaRef.current = {
      startX: event.clientX,
      startWidth: sidebarWidth,
    };
    setIsResizing(true);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        description="This page reuses indexed PR data from the existing backend and expands search across contributors and cached AI explanations."
        eyebrow="Search workspace"
        title="Search Results"
      />

      <div className="flex flex-col gap-3 xl:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <TextInput
            className="rounded-[12px] pl-11"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitSearch();
            }}
            placeholder="Search PRs, authors, labels, explanations..."
            value={query}
          />
        </div>
        <Button onClick={submitSearch} variant="outline" className="rounded-[12px]">
          <RefreshIcon className="h-4 w-4" />
          Apply Search
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {SEARCH_FILTERS.map((filter) => {
          const isActive = activeType === filter.id;
          return (
            <button
              key={filter.id}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150',
                isActive
                  ? 'bg-[#2563EB] text-white border border-[#2563EB]'
                  : 'border border-line bg-panel text-soft hover:bg-panel2 hover:text-ink'
              )}
              onClick={() => setActiveType(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div ref={layoutRef} className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          {visibleSections.prs.map((pr) => (
            <PRCard
              key={`search-pr-${pr.number}`}
              compact
              onOpen={openPR}
              onToggleSaved={toggleSaved}
              pr={pr}
              saved={isSaved(pr.number)}
              summary={summaryCache[pr.number]}
            />
          ))}

          {visibleSections.contributors.map((contributor) => (
            <Panel key={`contrib-${contributor.login}`} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {contributor.avatar_url ? (
                    <img alt={contributor.login} className="h-10 w-10 rounded-full object-cover" src={contributor.avatar_url} />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                      {contributor.login.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-base font-semibold text-ink">{contributor.login}</div>
                    <div className="text-sm text-soft">{contributor.matches} matching PRs</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => toggleContributorSaved(contributor)} size="sm" variant="ghost">
                    <BookmarkIcon className="h-4 w-4" filled={isContributorSaved(contributor.login)} />
                  </Button>
                  <Pill tone="violet">Contributor</Pill>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {contributor.prs.slice(0, 3).map((pr) => (
                  <button
                    key={pr.number}
                    className="rounded-full border border-white/10 bg-panel2 px-3 py-1 text-xs text-soft transition-colors hover:border-accent/30 hover:text-ink"
                    onClick={() => openPR(pr.number)}
                    type="button"
                  >
                    #{pr.number} · {pr.title}
                  </button>
                ))}
              </div>
            </Panel>
          ))}

          {visibleSections.ai.map(({ pr, summary }) => (
            <Panel key={`ai-${pr.number}`} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-ink">#{pr.number} · {pr.title}</div>
                  <div className="mt-1 font-mono text-xs text-soft">{pr.user.login}</div>
                </div>
                <Pill tone="accent">{summary._provider || 'AI'}</Pill>
              </div>
              <p className="mt-4 text-sm leading-6 text-soft">{summary.summary || summary.oneLiner}</p>
              <Button className="mt-4" onClick={() => openPR(pr.number)} size="sm" variant="outline">
                <SparklesIcon className="h-4 w-4" />
                Open explanation
              </Button>
            </Panel>
          ))}

          {visibleSections.kb.map((doc) => (
            <Panel key={`kb-${doc.id}`} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-ink">{doc.title}</div>
                  <p className="mt-2 text-sm leading-6 text-soft">{doc.snippet}</p>
                </div>
                <Pill tone="warn">KB</Pill>
              </div>
              <div className="mt-4 flex gap-2">
                <Button as="a" href={doc.url} rel="noreferrer" size="sm" target="_blank" variant="outline">
                  <BookIcon className="h-4 w-4" />
                  Open doc
                </Button>
                <Button onClick={() => toggleKbSaved(doc)} size="sm" variant="ghost">
                  <BookmarkIcon className="h-4 w-4" filled={isKbSaved(doc.id)} />
                  Save
                </Button>
              </div>
            </Panel>
          ))}

          {activeType === 'kb' && !visibleSections.kb.length && deferredQuery ? (
            <EmptyState
              description="No knowledge-base documents matched that query."
              title="No KB results"
            />
          ) : null}

          {!visibleSections.prs.length && !visibleSections.contributors.length && !visibleSections.ai.length && activeType !== 'kb' ? (
            <EmptyState
              action={
                hasMore ? (
                  <Button onClick={loadMore} variant="outline">
                    {loadingMore ? 'Indexing more PRs...' : 'Index 20 more PRs'}
                  </Button>
                ) : null
              }
              description="Client-side search is working over the indexed PR feed. Loading more pages can broaden the match set while we wait for a dedicated backend search endpoint."
              title="No search results yet"
            />
          ) : null}
        </div>

        <div
          className="relative w-full xl:min-w-[280px] xl:shrink-0 xl:w-[var(--search-sidebar-width)] xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto pb-6"
          style={{ '--search-sidebar-width': `${sidebarWidth}px` }}
        >
          <button
            aria-label="Resize search insights column"
            className={cn(
              'absolute -left-3 top-0 hidden h-full w-6 cursor-col-resize xl:block',
              isResizing ? 'before:bg-accent/60' : 'before:bg-line/80 hover:before:bg-accent/40',
              'before:absolute before:left-1/2 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:-translate-x-1/2 before:rounded-full'
            )}
            onMouseDown={startSidebarResize}
            type="button"
          />
          <div className="space-y-4 overflow-hidden">
          <Panel className="p-5">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-wider text-accent">SEARCH INSIGHTS</div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[8px] border border-line bg-panel2 p-4 shadow-sm">
                <div className="text-sm font-medium text-soft">PR matches</div>
                <div className="mt-1.5 text-[28px] font-bold leading-none text-accent">{visibleSections.prs.length}</div>
              </div>
              <div className="rounded-[8px] border border-line bg-panel2 p-4 shadow-sm">
                <div className="text-sm font-medium text-soft">Contributor matches</div>
                <div className="mt-1.5 text-[28px] font-bold leading-none text-accent">{visibleSections.contributors.length}</div>
              </div>
              <div className="rounded-[8px] border border-line bg-panel2 p-4 shadow-sm">
                <div className="text-sm font-medium text-soft">AI explanation matches</div>
                <div className="mt-1.5 text-[28px] font-bold leading-none text-accent">{visibleSections.ai.length}</div>
              </div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <UsersIcon className="h-4 w-4 text-accent" />
              Top contributors
            </div>
            <div className="mt-4 space-y-3">
              {mergedContributorResults.slice(0, 5).map((contributor) => (
                <div key={contributor.login} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-ink">{contributor.login}</span>
                  <span className="text-soft">{contributor.matches} matches</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <BookIcon className="h-4 w-4 text-warn" />
              Related labels
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {topLabels.length ? (
                topLabels.map(([label, count]) => (
                  <Pill key={label} tone="warn">
                    {label} · {count}
                  </Pill>
                ))
              ) : (
                <span className="text-sm text-soft">No label metadata in the current result set.</span>
              )}
            </div>
          </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
