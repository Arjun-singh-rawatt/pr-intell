import { useMemo, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext.jsx';
import { useDrawerPR } from '../hooks/useDrawerPR.js';
import { formatLargeNumber } from '../utils/format.js';
import { FEED_FILTERS, inferPRType, isBeginnerFriendly } from '../utils/pr.js';
import { BoltIcon, DatabaseIcon, FilterIcon, RefreshIcon, SearchIcon, SparklesIcon, UsersIcon } from '../components/common/Icons.jsx';
import { Button, EmptyState, MetricCard, SectionHeading, TextInput, cn } from '../components/common/UI.jsx';
import PRCard from '../components/pr/PRCard.jsx';


export default function FeedPage() {
  const {
    feedItems,
    feedLoading,
    feedError,
    hasMore,
    loadMore,
    loadingMore,
    refreshFeed,
    summaryCache,
    toggleSaved,
    isSaved,
  } = useAppData();
  const { openPR } = useDrawerPR();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [quickSearch, setQuickSearch] = useState('');
  const [, startTransition] = useTransition();

  const visibleItems = useMemo(() => {
    const query = quickSearch.trim().toLowerCase();

    return feedItems.filter((pr) => {
      const summary = summaryCache[pr.number];
      const type = inferPRType(pr, summary);
      const matchesFilter = filter === 'all'
        || (filter === 'beginner' ? isBeginnerFriendly(pr, summary) : type === filter);
      const matchesQuery = !query
        || pr.title.toLowerCase().includes(query)
        || pr.user.login.toLowerCase().includes(query)
        || (pr.body || '').toLowerCase().includes(query);

      return matchesFilter && matchesQuery;
    });
  }, [feedItems, filter, quickSearch, summaryCache]);

  const metrics = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const mergedThisWeek = feedItems.filter((pr) => new Date(pr.merged_at).getTime() >= weekAgo).length;
    const contributors = new Set(feedItems.map((pr) => pr.user.login)).size;
    const explanations = Object.keys(summaryCache).length;
    const kbDocuments = feedItems.reduce((count, pr) => {
      const summary = summaryCache[pr.number];
      return count + (summary?.relatedDocs?.length || 0);
    }, 0);

    return {
      mergedThisWeek,
      contributors,
      explanations,
      kbDocuments,
      queuedExplanations: Math.max(feedItems.length - explanations, 0),
    };
  }, [feedItems, summaryCache]);

  const openSearch = () => {
    const search = quickSearch.trim();
    navigate(search ? `/search?q=${encodeURIComponent(search)}` : '/search');
  };

  return (
    <div className="space-y-5">
      <SectionHeading
        actions={
          <>
            <div className="relative min-w-[220px] flex-1 lg:min-w-[260px]">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-soft" />
              <TextInput
                className="rounded-[12px] pl-10"
                onChange={(event) => setQuickSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') openSearch();
                }}
                placeholder="Search PRs, authors, files..."
                value={quickSearch}
              />
            </div>
            <Button onClick={openSearch} variant="outline" className="rounded-[12px]">
              <FilterIcon className="h-4 w-4" />
              Filters
            </Button>
            <Button onClick={refreshFeed} variant="light" className="rounded-[12px]">
              <RefreshIcon className="h-4 w-4 text-white" />
              Sync
            </Button>
          </>
        }
        description="Merged pull requests with AI explanations for contributors."
        title="Contributor Feed"
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          accent="text-success"
          icon={<BoltIcon className="h-5 w-5" />}
          label="Merged this week"
          meta="+18% vs last week"
          metaClass="text-success"
          value={formatLargeNumber(metrics.mergedThisWeek)}
        />
        <MetricCard
          accent="text-accent"
          icon={<UsersIcon className="h-5 w-5" />}
          label="Active contributors"
          meta="Unique authors in feed"
          metaClass="text-soft"
          value={formatLargeNumber(metrics.contributors)}
        />
        <MetricCard
          accent="text-violet"
          icon={<SparklesIcon className="h-5 w-5" />}
          label="AI explanations"
          meta={metrics.queuedExplanations ? `+${metrics.queuedExplanations} queued` : 'Cached in session'}
          metaClass="text-warn"
          value={formatLargeNumber(metrics.explanations)}
        />
        <MetricCard
          accent="text-warn"
          icon={<DatabaseIcon className="h-5 w-5" />}
          label="KB documents"
          meta="Linked from summaries"
          metaClass="text-soft"
          value={formatLargeNumber(metrics.kbDocuments)}
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {FEED_FILTERS.map((item) => {
          const isActive = filter === item.id;
          return (
            <button
              key={item.id}
              className={cn(
                'rounded-full px-4 py-1.5 text-[13px] font-semibold transition-all duration-150',
                isActive
                  ? 'border border-accent bg-accent text-white'
                  : 'border border-line bg-panel text-soft hover:bg-panel2 hover:text-ink'
              )}
              onClick={() => {
                startTransition(() => {
                  setFilter(item.id);
                });
              }}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {feedError ? (
        <div className="rounded-card border border-warn/30 bg-warn/10 p-4 text-sm text-warn">{feedError}</div>
      ) : null}

      {feedLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="glass-panel h-64 animate-pulse rounded-card" />
          ))}
        </div>
      ) : visibleItems.length ? (
        <div className="grid gap-3">
          {visibleItems.map((pr) => (
            <PRCard
              key={pr.number}
              onOpen={openPR}
              onToggleSaved={toggleSaved}
              pr={pr}
              saved={isSaved(pr.number)}
              summary={summaryCache[pr.number]}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try a different filter or broaden the search. The backend feed itself is still connected and healthy."
          title="No PRs match the current view"
        />
      )}

      {hasMore ? (
        <div className="flex justify-center">
          <Button onClick={loadMore} variant="outline">
            {loadingMore ? 'Loading more PRs...' : 'Load 20 more PRs'}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
