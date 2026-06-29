import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '../../context/AppDataContext.jsx';
import { formatAbsoluteDate } from '../../utils/format.js';
import { getTypeMeta, inferPRType } from '../../utils/pr.js';
import {
  BookmarkIcon,
  BookIcon,
  ExternalLinkIcon,
  FileDiffIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from '../common/Icons.jsx';
import { Button, Panel, Pill, cn } from '../common/UI.jsx';

/**
 * ============================================================================
 * AI Provider Router Status
 * ============================================================================
 * 
 * This component displays the health status of available AI providers
 * (Claude, Gemini, OpenAI, Grok, DeepSeek, Ollama).
 * 
 * The backend routes PR summarization requests through available providers,
 * falling back to Ollama when primary providers are exhausted.
 * 
 * STATUS INDICATORS:
 * - Green (success): Provider is configured and has quota available
 * - Yellow (warn): Provider is configured but exhausted/degraded
 * - Gray (neutral): Provider not configured (API key missing)
 * - Blue (accent): Ollama fallback is available
 * 
 * DATA SOURCE: GET /api/prs/router-status
 * - Returns via AppDataContext: routerStatus
 * - Auto-refreshed on each summarization request
 * 
 * FEATURES:
 * ✅ Real-time provider status monitoring
 * ✅ Current provider cursor tracking
 * ✅ Visual health indicators
 * 
 * POTENTIAL ENHANCEMENTS:
 * ❌ Cost tracking per provider (not implemented)
 * ❌ Historical usage statistics (not implemented)
 * ❌ Provider preference settings (not implemented)
 * ❌ Manual provider selection (not implemented)
 * ❌ Provider queue visualization (not implemented)
 */

function RouterStatusStrip({ routerStatus }) {
  if (!routerStatus) return null;

  return (
    <Panel className="mb-5 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.24em] text-soft">AI pool</span>
        <span className="font-mono text-[11px] text-soft">cursor {routerStatus.currentIndex ?? 0}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {routerStatus.providers.map((provider) => {
          const tone = !provider.configured
            ? 'neutral'
            : provider.exhausted
              ? 'warn'
              : 'success';

          return (
            <Pill key={provider.id} tone={tone}>
              {provider.id}
            </Pill>
          );
        })}
        <Pill tone="accent">ollama fallback</Pill>
      </div>
    </Panel>
  );
}

function SummarySection({ summary, onExplain, loading, error }) {
  if (!summary && !loading) {
    return (
      <Button className="w-full justify-center" onClick={onExplain} size="lg">
        <SparklesIcon className="h-4 w-4" />
        Explain with AI
      </Button>
    );
  }

  if (loading) {
    return (
      <Panel className="border-accent/20 bg-accent/6 p-5">
        <div className="flex items-center gap-2 text-sm text-accent">
          <SparklesIcon className="h-4 w-4" />
          Routing this PR through the available AI providers...
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-2 rounded-full bg-white/8" />
          <div className="h-2 w-5/6 rounded-full bg-white/8" />
          <div className="h-2 w-3/4 rounded-full bg-white/8" />
        </div>
      </Panel>
    );
  }

  if (error) {
    return (
      <Panel className="border-warn/30 bg-warn/10 p-4 text-sm text-warn">
        {error}
      </Panel>
    );
  }

  const type = inferPRType(null, summary);
  const typeMeta = getTypeMeta(type);

  return (
    <Panel className="border-accent/20 bg-accent/6 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-accent">AI Summary</span>
        <span className="font-mono text-[11px] text-soft">via {summary._provider || 'router'}</span>
        <span className={cn('ml-auto rounded-full border px-2.5 py-1 text-xs', typeMeta.pill)}>{typeMeta.label}</span>
        <Pill tone="violet">{summary.difficulty || 'intermediate'}</Pill>
      </div>
      <p className="mt-4 whitespace-pre-wrap break-words text-base font-semibold leading-7 text-ink">{summary.oneLiner}</p>
      <div className="mt-4 space-y-4">
        {summary.summary ? (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Summary</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-soft">{summary.summary}</p>
          </div>
        ) : null}
        {summary.problemSolved ? (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Problem solved</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-soft">{summary.problemSolved}</p>
          </div>
        ) : null}
        {summary.technicalDetails ? (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Technical details</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-soft">{summary.technicalDetails}</p>
          </div>
        ) : null}
        {summary.whatToLearn ? (
          <div>
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-warn">
              <BookIcon className="h-3.5 w-3.5" />
              What to learn
            </p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-ink">{summary.whatToLearn}</p>
          </div>
        ) : null}
        {summary.similarContribution ? (
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Next contribution idea</p>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-soft">{summary.similarContribution}</p>
          </div>
        ) : null}
      </div>
      <Button className="mt-5" onClick={onExplain} variant="ghost">
        <SparklesIcon className="h-4 w-4" />
        Re-explain
      </Button>
    </Panel>
  );
}

export default function PRDetailDrawer({ prNumber, onClose }) {
  const {
    detailCache,
    detailLoading,
    getDetail,
    summaryCache,
    summaryLoading,
    summarize,
    routerStatus,
    refreshRouterStatus,
    toggleSaved,
    toggleKbSaved,
    isSaved,
    isKbSaved,
  } = useAppData();
  const [detailError, setDetailError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const detail = prNumber ? detailCache[prNumber] : null;
  const summary = prNumber ? summaryCache[prNumber] : null;
  const loadingDetail = prNumber ? detailLoading[prNumber] : false;
  const loadingSummary = prNumber ? summaryLoading[prNumber] : false;

  useEffect(() => {
    if (!prNumber) return undefined;

    setDetailError(null);
    setSummaryError(null);

    getDetail(prNumber).catch((error) => {
      setDetailError(error.response?.data?.error || error.message);
    });

    refreshRouterStatus();

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [getDetail, onClose, prNumber, refreshRouterStatus]);

  const handleExplain = async () => {
    if (!prNumber) return;
    setSummaryError(null);
    try {
      await summarize(prNumber);
    } catch (error) {
      setSummaryError(error.response?.data?.error || error.message);
    }
  };

  const saved = prNumber ? isSaved(prNumber) : false;
  const typeMeta = useMemo(() => {
    const current = detail?.pr;
    return current ? getTypeMeta(inferPRType(current, summary)) : null;
  }, [detail, summary]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity',
          prNumber ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-white/8 bg-shell shadow-2xl transition-transform duration-300',
          prNumber ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <div className="font-mono text-xs text-soft">PR #{prNumber || '—'}</div>
            <div className="text-sm font-semibold text-ink">Detailed breakdown</div>
          </div>
          <div className="flex items-center gap-2">
            {detail?.pr?.html_url ? (
              <Button as="a" href={detail.pr.html_url} rel="noreferrer" size="sm" target="_blank" variant="ghost">
                <ExternalLinkIcon className="h-4 w-4" />
                GitHub
              </Button>
            ) : null}
            {detail?.pr ? (
              <Button onClick={() => toggleSaved(detail.pr, detail, summary)} size="sm" variant="ghost">
                <BookmarkIcon filled={saved} className="h-4 w-4" />
                {saved ? 'Saved' : 'Save'}
              </Button>
            ) : null}
            <Button aria-label="Close details" onClick={onClose} size="icon" variant="ghost">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <RouterStatusStrip routerStatus={routerStatus} />

          {loadingDetail && !detail ? (
            <div className="space-y-3">
              <div className="h-8 w-2/3 rounded-xl bg-white/6" />
              <div className="h-4 w-1/2 rounded-xl bg-white/6" />
              <div className="h-32 rounded-2xl bg-white/6" />
            </div>
          ) : null}

          {detailError ? (
            <Panel className="border-warn/30 bg-warn/10 p-4 text-sm text-warn">{detailError}</Panel>
          ) : null}

          {detail?.pr ? (
            <div className="space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {typeMeta ? (
                    <span className={cn('rounded-full border px-2.5 py-1 text-xs', typeMeta.pill)}>{typeMeta.label}</span>
                  ) : null}
                  <span className="font-mono text-xs text-soft">{detail.pr.user.login}</span>
                  <span className="font-mono text-xs text-soft">merged {formatAbsoluteDate(detail.pr.merged_at)}</span>
                </div>
                <h2 className="mt-3 break-words text-2xl font-bold tracking-tight text-ink">{detail.pr.title}</h2>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-soft">
                  <span className="flex items-center gap-1.5">
                    <FileDiffIcon className="h-3.5 w-3.5" />
                    {detail.pr.changed_files} files
                  </span>
                  <span className="flex items-center gap-1 text-success">
                    <PlusIcon className="h-3 w-3" />
                    {detail.pr.additions}
                  </span>
                  <span className="flex items-center gap-1 text-red">
                    <MinusIcon className="h-3 w-3" />
                    {detail.pr.deletions}
                  </span>
                </div>
                {detail.pr.labels.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {detail.pr.labels.map((label) => (
                      <span
                        key={label.name}
                        className="rounded-full border border-white/10 bg-panel2 px-3 py-1 text-xs text-soft"
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <SummarySection
                error={summaryError}
                loading={loadingSummary}
                onExplain={handleExplain}
                summary={summary}
              />

              {detail.pr.body ? (
                <Panel className="p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">PR description</p>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-soft">{detail.pr.body}</p>
                </Panel>
              ) : null}

              <Panel className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">
                    Files changed ({detail.files.length})
                  </p>
                  {!detail.files.length ? (
                    <span className="text-xs text-soft">No file metadata returned</span>
                  ) : null}
                </div>
                <div className="mt-4 space-y-3">
                  {detail.files.map((file) => (
                    <div
                      key={file.filename}
                      className="rounded-xl border border-white/8 bg-panel2/70 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">{file.status}</div>
                          <div className="mt-1 break-all text-sm text-ink">{file.filename}</div>
                        </div>
                        <div className="shrink-0 text-right text-xs">
                          <div className="text-success">+{file.additions}</div>
                          <div className="text-red">-{file.deletions}</div>
                        </div>
                      </div>
                      {file.patch ? (
                        <div className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-white/6 bg-black/20 p-3 font-mono text-[11px] leading-5 text-soft">
                          {file.patch}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Comments</p>
                  <span className="text-xs text-soft">{detail.comments.length} fetched</span>
                </div>
                {detail.comments.length ? (
                  <div className="mt-4 space-y-3">
                    {detail.comments.map((comment, index) => (
                      <div key={`${comment.user}-${index}`} className="rounded-xl border border-white/8 bg-panel2/70 p-3">
                        <div className="font-mono text-xs text-accent">@{comment.user}</div>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-soft">{comment.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-black/10 p-4 text-sm text-soft">
                    No recent issue comments were returned for this PR.
                  </div>
                )}
              </Panel>

              {summary?.relatedDocs?.length ? (
                <Panel className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-soft">Related docs</p>
                    {summary.judgeScore ? (
                      <Pill tone="accent">judge {summary.judgeScore}</Pill>
                    ) : null}
                  </div>
                  <div className="mt-4 space-y-3">
                    {summary.relatedDocs.map((doc) => (
                      <div key={doc.id} className="rounded-xl border border-white/8 bg-panel2/70 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-ink">{doc.title}</div>
                            <p className="mt-1 break-words text-sm text-soft">{doc.snippet}</p>
                          </div>
                          <Button onClick={() => toggleKbSaved(doc)} size="sm" variant="ghost">
                            <BookmarkIcon className="h-4 w-4" filled={isKbSaved(doc.id)} />
                          </Button>
                        </div>
                        <Button as="a" className="mt-3" href={doc.url} rel="noreferrer" size="sm" target="_blank" variant="outline">
                          Open doc
                        </Button>
                      </div>
                    ))}
                  </div>
                </Panel>
              ) : null}
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
}
