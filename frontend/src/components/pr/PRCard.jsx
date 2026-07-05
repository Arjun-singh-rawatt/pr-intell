import { formatRelativeDate } from '../../utils/format.js';
import { getTypeMeta, inferPRType, summarizeLabels } from '../../utils/pr.js';
import {
  ArrowRightIcon,
  BookmarkIcon,
  FileDiffIcon,
  MergeIcon,
  SparklesIcon,
} from '../common/Icons.jsx';
import { Button, Panel } from '../common/UI.jsx';

function Avatar({ user }) {
  return user?.avatar_url ? (
    <img alt={user.login} className="h-8 w-8 rounded-full border border-line object-cover" src={user.avatar_url} />
  ) : (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-active text-xs font-semibold text-accent">
      {(user?.login || 'PR').slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function PRCard({
  pr,
  summary,
  saved,
  onOpen,
  onToggleSaved,
  compact = false,
}) {
  const type = inferPRType(pr, summary);
  const typeMeta = getTypeMeta(type);
  const labelPreview = summarizeLabels(pr);
  const judgeScore = summary?.judgeScore ?? summary?.score;

  const isBugfix = type === 'bugfix';
  const badgeLabel = isBugfix ? 'Bug fix' : type === 'feature' ? 'Feature' : typeMeta.label;
  const badgeOutlineColor = isBugfix ? 'border-red/50 text-red' : 'border-accent/40 text-accent';
  const isSavedPage = compact && judgeScore !== undefined;

  return (
    <Panel className="rounded-[12px] border border-line bg-panel p-5 shadow-sm transition-all duration-150 hover:border-accent/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar user={pr.user} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink">{pr.user?.login}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 text-[12px] font-semibold text-success">
                <MergeIcon className="h-3 w-3 shrink-0" />
                Merged
              </span>
              <span className={`inline-flex items-center rounded-full border bg-panel2 px-2.5 py-0.5 text-[12px] font-semibold ${badgeOutlineColor}`}>
                {badgeLabel}
              </span>
            </div>
            <p className="mt-1 text-[12px] font-medium text-soft">
              Rocket.Chat · #{pr.number} · {formatRelativeDate(pr.merged_at)}
            </p>
          </div>
        </div>

        <Button
          aria-label={saved ? 'Remove bookmark' : 'Save bookmark'}
          className={saved ? 'text-accent' : 'text-soft'}
          onClick={() => onToggleSaved(pr)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <BookmarkIcon filled={saved} className="h-[18px] w-[18px]" />
        </Button>
      </div>

      <div className="mt-3.5">
        <h3 className="cursor-pointer text-[15px] font-bold leading-snug text-ink hover:text-accent" onClick={() => onOpen(pr.number)}>
          {pr.title}
        </h3>
        {labelPreview.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {labelPreview.map((label) => (
              <span
                key={label.name}
                className="rounded-full bg-panel2 px-2.5 py-0.5 text-[12px] font-medium text-soft"
              >
                {label.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-3.5 rounded-[12px] border border-violet/15 bg-[rgba(69,96,164,0.08)] p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-[16px] w-[16px] text-violet" />
            <span className="text-[13px] font-semibold text-violet">AI Summary</span>
          </div>
          {isSavedPage ? (
            <span className="text-[12px] font-semibold text-accent">
              Judge {judgeScore ?? '9'}/10
            </span>
          ) : (
            <span className="text-[12px] font-medium text-soft">
              {summary?._provider ? `via ${summary._provider}` : 'on demand'}
            </span>
          )}
        </div>
        {summary ? (
          <div className={`mt-2.5 rounded-[8px] border p-3 text-[13px] leading-relaxed text-ink ${isSavedPage ? 'border-line bg-panel/80' : 'border-dashed border-line bg-panel'}`}>
            {summary.summary || summary.oneLiner}
          </div>
        ) : (
          <div className="mt-2.5 rounded-[8px] border border-dashed border-line bg-panel p-3 text-[13px] text-soft">
            Open this PR to generate an explanation from the existing AI backend.
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-3.5">
        <div className="flex items-center gap-3 text-[12px]">
          <span className="flex items-center gap-1 font-medium text-soft">
            <FileDiffIcon className="h-4 w-4 shrink-0" />
            {pr.changed_files ?? '0'} files
          </span>
          <span className="font-semibold text-success">
            +{pr.additions ?? 0}
          </span>
          <span className="font-semibold text-red">
            -{pr.deletions ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-accent px-3 text-[13px] font-semibold text-white transition-colors hover:bg-accent2"
            onClick={() => onOpen(pr.number)}
            type="button"
          >
            View details
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </Panel>
  );
}
