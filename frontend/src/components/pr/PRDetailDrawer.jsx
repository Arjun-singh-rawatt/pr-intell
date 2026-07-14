import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteExplanation,
  fetchExplanations,
  generateExplanation,
  rateExplanation,
} from '../../api/explanations.js';
import { useAppData } from '../../context/AppDataContext.jsx';
import { formatAbsoluteDate } from '../../utils/format.js';
import { getTypeMeta, inferPRType } from '../../utils/pr.js';
import {
  BookmarkIcon,
  ExternalLinkIcon,
  FileDiffIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  XIcon,
} from '../common/Icons.jsx';
import { Button, Panel, Pill, TextInput, cn } from '../common/UI.jsx';

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

function sortExplanations(items) {
  return [...items].sort((left, right) => {
    if (right.score !== left.score) return right.score - left.score;
    if ((right.ratingCount || 0) !== (left.ratingCount || 0)) {
      return (right.ratingCount || 0) - (left.ratingCount || 0);
    }
    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}

function explanationToSummaryPreview(explanation) {
  if (!explanation) return null;

  return {
    summary: explanation.content,
    _provider: explanation.provider,
    score: explanation.score,
  };
}

function formatScore(score) {
  if (!Number.isFinite(score)) return '0';
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function ExplanationCard({
  explanation,
  currentUserId,
  authLoading,
  ratePendingId,
  deletePendingId,
  onRate,
  onDelete,
}) {
  const [ratingInput, setRatingInput] = useState(
    explanation.currentUserRating ? String(explanation.currentUserRating) : ''
  );
  const isOwner = Boolean(currentUserId && explanation.generatedBy?.userId === currentUserId);
  const rateDisabled = authLoading || !currentUserId || ratePendingId === explanation.id;
  const deleteDisabled = deletePendingId === explanation.id;

  useEffect(() => {
    setRatingInput(explanation.currentUserRating ? String(explanation.currentUserRating) : '');
  }, [explanation.currentUserRating]);

  const handleRateSubmit = () => {
    const parsed = Number.parseInt(ratingInput, 10);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
      return;
    }
    onRate(explanation.id, parsed);
  };

  return (
    <Panel className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-ink">
              {explanation.generatedBy?.username || 'Anonymous'}
            </span>
            <Pill tone="accent">{explanation.provider || 'AI'}</Pill>
            <span className="font-mono text-[11px] text-soft">
              {formatAbsoluteDate(explanation.createdAt)}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">Rating</span>
              <div className="mt-1 font-semibold text-ink">{formatScore(explanation.score)} / 10</div>
            </div>
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">Raters</span>
              <div className="mt-1 font-semibold text-ink">{explanation.ratingCount || 0}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <TextInput
            className="w-[96px]"
            disabled={rateDisabled}
            inputMode="numeric"
            max="10"
            min="1"
            onChange={(event) => setRatingInput(event.target.value)}
            placeholder="1-10"
            type="number"
            value={ratingInput}
          />
          <Button
            disabled={
              rateDisabled
              || !ratingInput
              || Number.parseInt(ratingInput, 10) < 1
              || Number.parseInt(ratingInput, 10) > 10
            }
            onClick={handleRateSubmit}
            size="sm"
            type="button"
            variant="outline"
          >
            {ratePendingId === explanation.id ? 'Saving...' : 'Rate /10'}
          </Button>
          {isOwner ? (
            <Button
              className="text-red"
              disabled={deleteDisabled}
              onClick={() => onDelete(explanation.id)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      {explanation.currentUserRating ? (
        <div className="mt-3 text-xs text-soft">Your rating: {explanation.currentUserRating} / 10</div>
      ) : null}

      <div className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-soft">
        {explanation.content}
      </div>
    </Panel>
  );
}

function SharedExplanationsSection({
  authLoading,
  currentUser,
  deletePendingId,
  error,
  explanations,
  generating,
  loading,
  shareSuccess,
  hasSharedExplanation,
  onDelete,
  onGenerate,
  onRate,
  ratePendingId,
}) {
  const isSignedIn = Boolean(currentUser?.id);

  return (
    <div className="space-y-4">
      <Panel className="border-accent/20 bg-accent/6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-accent">Shared AI Explanations</div>
            <p className="mt-1 text-sm leading-6 text-soft">
              Shared across everyone reviewing this pull request. Rate each explanation from 1 to 10.
            </p>
          </div>
          <Button
            disabled={!isSignedIn || authLoading || generating || hasSharedExplanation}
            onClick={onGenerate}
            size="sm"
            type="button"
          >
            <SparklesIcon className="h-4 w-4" />
            {hasSharedExplanation ? 'Explanation Shared' : generating ? 'Sharing...' : 'Share Your Explanation'}
          </Button>
        </div>

        {!isSignedIn && !authLoading ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-warn">Sign in with GitHub to rate or share explanations.</p>
            <Button onClick={() => { window.location.href = '/api/auth/github'; }} size="sm" type="button">
              Sign in with GitHub
            </Button>
          </div>
        ) : null}
      </Panel>

      {shareSuccess ? (
        <Panel className="border-success/30 bg-success/10 p-4 text-sm text-success">
          Shared successfully.
        </Panel>
      ) : null}

      {error ? (
        <Panel className="border-warn/30 bg-warn/10 p-4 text-sm text-warn">
          {error}
        </Panel>
      ) : null}

      {loading && !explanations.length ? (
        <Panel className="p-5">
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-white/8" />
            <div className="h-2 w-5/6 rounded-full bg-white/8" />
            <div className="h-2 w-3/4 rounded-full bg-white/8" />
          </div>
        </Panel>
      ) : null}

      {!loading && !explanations.length ? (
        <Panel className="border-dashed border-white/10 bg-black/10 p-5 text-sm text-soft">
          No shared explanations yet. Share the first explanation for this PR.
        </Panel>
      ) : null}

      {explanations.map((explanation) => (
        <ExplanationCard
          key={explanation.id}
          authLoading={authLoading}
          currentUserId={currentUser?.id || ''}
          deletePendingId={deletePendingId}
          explanation={explanation}
          onDelete={onDelete}
          onRate={onRate}
          ratePendingId={ratePendingId}
        />
      ))}
    </div>
  );
}

export default function PRDetailDrawer({ prNumber, onClose }) {
  const {
    detailCache,
    detailLoading,
    getDetail,
    currentUser,
    authLoading,
    summaryCache,
    cacheSummary,
    routerStatus,
    refreshRouterStatus,
    toggleSaved,
    toggleKbSaved,
    isSaved,
    isKbSaved,
  } = useAppData();
  const [detailError, setDetailError] = useState(null);
  const [explanations, setExplanations] = useState([]);
  const [explanationsLoading, setExplanationsLoading] = useState(false);
  const [explanationsError, setExplanationsError] = useState(null);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [generatingExplanation, setGeneratingExplanation] = useState(false);
  const [ratePendingId, setRatePendingId] = useState('');
  const [deletePendingId, setDeletePendingId] = useState('');

  const detail = prNumber ? detailCache[prNumber] : null;
  const summary = prNumber ? summaryCache[prNumber] : null;
  const loadingDetail = prNumber ? detailLoading[prNumber] : false;
  const hasSharedExplanation = useMemo(
    () => explanations.some((item) => item.generatedBy?.userId === currentUser?.id),
    [currentUser?.id, explanations]
  );

  const loadExplanations = useCallback(async (targetPrNumber, clearExisting = false) => {
    if (!targetPrNumber) return;

    if (clearExisting) {
      setExplanations([]);
    }

    setExplanationsLoading(true);
    setExplanationsError(null);

    try {
      const data = await fetchExplanations(targetPrNumber);
      setExplanations(sortExplanations(data));
    } catch (error) {
      setExplanationsError(error.response?.data?.error || error.message);
    } finally {
      setExplanationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!prNumber) return undefined;

    setDetailError(null);
    setExplanationsError(null);
    setShareSuccess(false);
    loadExplanations(prNumber, true);

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
  }, [getDetail, loadExplanations, onClose, prNumber, refreshRouterStatus]);

  useEffect(() => {
    if (!prNumber || explanationsLoading) return;
    cacheSummary(prNumber, explanationToSummaryPreview(explanations[0]) || null);
  }, [cacheSummary, explanations, explanationsLoading, prNumber]);

  const handleGenerateExplanation = async () => {
    if (!prNumber || !currentUser?.id || generatingExplanation) return;

    setGeneratingExplanation(true);
    setExplanationsError(null);
    setShareSuccess(false);

    try {
      const created = await generateExplanation(prNumber);
      setExplanations((current) => sortExplanations([created, ...current]));
      setShareSuccess(true);
      await refreshRouterStatus();
    } catch (error) {
      if (error.response?.status === 409 && hasSharedExplanation) {
        setExplanationsError(null);
        setShareSuccess(true);
      } else {
      const status = error.response?.status;
        if (status && status >= 500) {
          await refreshRouterStatus();
        } else {
          setExplanationsError(error.response?.data?.error || error.message);
        }
      }
    } finally {
      setGeneratingExplanation(false);
    }
  };

  const handleRate = async (explanationId, rating) => {
    if (!prNumber || !currentUser?.id) return;

    setRatePendingId(explanationId);
    setExplanationsError(null);

    try {
      const updated = await rateExplanation(prNumber, explanationId, rating);
      setExplanations((current) =>
        sortExplanations(current.map((item) => (item.id === updated.id ? updated : item)))
      );
    } catch (error) {
      setExplanationsError(error.response?.data?.error || error.message);
    } finally {
      setRatePendingId('');
    }
  };

  const handleDelete = async (explanationId) => {
    if (!prNumber || !currentUser?.id) return;

    setDeletePendingId(explanationId);
    setExplanationsError(null);

    try {
      await deleteExplanation(prNumber, explanationId);
      setExplanations((current) => current.filter((item) => item.id !== explanationId));
    } catch (error) {
      setExplanationsError(error.response?.data?.error || error.message);
    } finally {
      setDeletePendingId('');
    }
  };

  const saved = prNumber ? isSaved(prNumber) : false;
  const featuredSummary = explanations[0] ? explanationToSummaryPreview(explanations[0]) : summary;
  const typeMeta = useMemo(() => {
    const current = detail?.pr;
    return current ? getTypeMeta(inferPRType(current, featuredSummary)) : null;
  }, [detail, featuredSummary]);

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
            <div className="font-mono text-xs text-soft">PR #{prNumber || '-'}</div>
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
              <Button onClick={() => toggleSaved(detail.pr, detail, featuredSummary || summary)} size="sm" variant="ghost">
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

              <SharedExplanationsSection
                authLoading={authLoading}
                currentUser={currentUser}
                deletePendingId={deletePendingId}
                error={explanationsError}
                explanations={explanations}
                generating={generatingExplanation}
                hasSharedExplanation={hasSharedExplanation}
                loading={explanationsLoading}
                onDelete={handleDelete}
                onGenerate={handleGenerateExplanation}
                onRate={handleRate}
                ratePendingId={ratePendingId}
                shareSuccess={shareSuccess}
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
