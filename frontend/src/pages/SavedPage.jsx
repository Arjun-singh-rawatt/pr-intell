import { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext.jsx';
import { useDrawerPR } from '../hooks/useDrawerPR.js';
import { formatLargeNumber } from '../utils/format.js';
import { ArrowDownUpIcon, BookmarkIcon, BookIcon, SparklesIcon, UsersIcon } from '../components/common/Icons.jsx';
import { Button, EmptyState, MetricCard, Panel, SectionHeading, TextInput } from '../components/common/UI.jsx';
import PRCard from '../components/pr/PRCard.jsx';

export default function SavedPage() {
  const {
    savedList,
    savedKbList,
    savedContributorList,
    toggleSaved,
    toggleKbSaved,
    toggleContributorSaved,
    summaryCache,
    isSaved,
    isKbSaved,
    isContributorSaved,
  } = useAppData();
  const { openPR } = useDrawerPR();
  const [query, setQuery] = useState('');

  const lowered = query.trim().toLowerCase();

  const filteredPRs = useMemo(() => {
    return savedList.filter((item) => {
      if (!lowered) return true;
      return (
        item.pr.title.toLowerCase().includes(lowered)
        || item.pr.user.login.toLowerCase().includes(lowered)
        || (item.summary?.summary || '').toLowerCase().includes(lowered)
      );
    });
  }, [lowered, savedList]);

  const filteredKb = useMemo(() => {
    return savedKbList.filter((item) => {
      if (!lowered) return true;
      return (
        item.doc.title.toLowerCase().includes(lowered)
        || item.doc.snippet.toLowerCase().includes(lowered)
      );
    });
  }, [lowered, savedKbList]);

  const filteredContributors = useMemo(() => {
    return savedContributorList.filter((item) => {
      if (!lowered) return true;
      return item.contributor.login.toLowerCase().includes(lowered);
    });
  }, [lowered, savedContributorList]);

  const metrics = useMemo(() => {
    const explained = savedList.filter((item) => item.summary).length;
    const contributors = new Set(savedList.map((item) => item.pr.user.login)).size;

    return { explained, contributors };
  }, [savedList]);

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <TextInput
              className="rounded-full sm:min-w-[280px]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search saved items..."
              value={query}
            />
            <Button variant="outline" className="rounded-full">
              <ArrowDownUpIcon className="h-4 w-4" />
              Sort
            </Button>
          </div>
        }
        description="Saved PRs, knowledge-base docs, and contributor profiles persist in backend/data/store.json."
        eyebrow="Bookmarks"
        title="Saved Items"
      />

      <div className="grid gap-4 xl:grid-cols-3 md:grid-cols-2">
        <MetricCard
          accent="text-[#2563EB]"
          icon={<BookmarkIcon className="h-5 w-5" filled />}
          label="Saved PRs"
          meta="Synced to backend store."
          metaClass="text-[#6B7280]"
          value={formatLargeNumber(savedList.length)}
        />
        <MetricCard
          accent="text-[#7C3AED]"
          icon={<SparklesIcon className="h-5 w-5" />}
          label="AI explained"
          meta="Bookmarks with cached summaries."
          metaClass="text-[#6B7280]"
          value={formatLargeNumber(metrics.explained)}
        />
        <MetricCard
          accent="text-[#2563EB]"
          icon={<UsersIcon className="h-5 w-5" />}
          label="Contributors saved"
          meta="Unique authors represented."
          metaClass="text-[#6B7280]"
          value={formatLargeNumber(metrics.contributors)}
        />
      </div>

      {filteredPRs.length ? (
        <div className="grid gap-4">
          {filteredPRs.map((item) => (
            <PRCard
              key={item.id}
              compact
              onOpen={openPR}
              onToggleSaved={toggleSaved}
              pr={item.pr}
              saved={isSaved(item.pr.number)}
              summary={item.summary || summaryCache[item.pr.number]}
            />
          ))}
        </div>
      ) : null}

      {filteredKb.length ? (
        <div className="grid gap-4">
          {filteredKb.map((item) => (
            <Panel key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-ink">{item.doc.title}</div>
                  <p className="mt-2 text-sm leading-6 text-soft">{item.doc.snippet}</p>
                </div>
                <Button onClick={() => toggleKbSaved(item.doc)} size="sm" variant="ghost">
                  <BookmarkIcon className="h-4 w-4" filled={isKbSaved(item.doc.id)} />
                  {isKbSaved(item.doc.id) ? 'Saved' : 'Save'}
                </Button>
              </div>
              <Button as="a" className="mt-4" href={item.doc.url} rel="noreferrer" size="sm" target="_blank" variant="outline">
                Open doc
              </Button>
            </Panel>
          ))}
        </div>
      ) : null}

      {filteredContributors.length ? (
        <div className="grid gap-4">
          {filteredContributors.map((item) => (
            <Panel key={item.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.contributor.avatar_url ? (
                    <img alt={item.contributor.login} className="h-10 w-10 rounded-full object-cover" src={item.contributor.avatar_url} />
                  ) : null}
                  <div>
                    <div className="text-base font-semibold text-ink">{item.contributor.login}</div>
                    <div className="text-sm text-soft">Contributor profile</div>
                  </div>
                </div>
                <Button onClick={() => toggleContributorSaved(item.contributor)} size="sm" variant="ghost">
                  <BookmarkIcon className="h-4 w-4" filled={isContributorSaved(item.contributor.login)} />
                  {isContributorSaved(item.contributor.login) ? 'Saved' : 'Save'}
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      ) : null}

      {!savedList.length && !savedKbList.length && !savedContributorList.length ? (
        <EmptyState
          description="Save any PR from the feed or detail drawer to build your study list here."
          title="No saved PRs yet"
        />
      ) : null}

      {(savedList.length || savedKbList.length || savedContributorList.length) ? (
        <Panel className="p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <BookIcon className="h-4 w-4 text-warn" />
            Saved coverage
          </div>
          <p className="mt-3 text-sm leading-6 text-soft">
            {savedList.length} PRs · {savedKbList.length} KB docs · {savedContributorList.length} contributors saved to the backend store.
          </p>
        </Panel>
      ) : null}
    </div>
  );
}
