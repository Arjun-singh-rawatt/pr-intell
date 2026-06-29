import { BranchIcon, PlusIcon, RefreshIcon, TrashIcon, WarningIcon } from '../common/Icons.jsx';
import { Button, Panel, Pill, Toggle } from '../common/UI.jsx';

export default function RepositorySettingsPanel({ repository, feedItems, summaryCount }) {
  const latestMerge = feedItems[0]?.merged_at;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Repositories</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-soft">
            The current backend is hard-wired to one repository, so this view surfaces that real connection and keeps the full management layout ready for future API support.
          </p>
        </div>
        <Button disabled>
          <PlusIcon className="h-4 w-4" />
          Add Repository
        </Button>
      </div>

      <Panel className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xl font-semibold text-ink">{repository.fullName}</div>
            <div className="font-mono text-xs text-soft">{repository.provider} · branch {repository.branch}</div>
          </div>
          <Pill tone="success">Active</Pill>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-panel2/75 p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">indexed_prs</div>
            <div className="mt-2 text-2xl font-bold text-ink">{feedItems.length}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-panel2/75 p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">ai_explained</div>
            <div className="mt-2 text-2xl font-bold text-violet">{summaryCount}</div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-panel2/75 p-4">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">latest_merge</div>
            <div className="mt-2 text-sm font-medium text-ink">
              {latestMerge ? new Date(latestMerge).toLocaleDateString('en-IN') : 'Awaiting feed data'}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/8 bg-panel2/75 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">sync_frequency</div>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-ink">
                  Daily
                  <BranchIcon className="h-4 w-4 text-soft" />
                </div>
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">auto_explain</div>
                <div className="mt-2">
                  <Toggle checked disabled />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled variant="outline">
                <RefreshIcon className="h-4 w-4" />
                Sync Now
              </Button>
              <Button disabled variant="ghost">
                <TrashIcon className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel className="border-dashed border-white/10 p-5">
        <div className="flex items-start gap-3">
          <WarningIcon className="mt-1 h-5 w-5 text-warn" />
          <div>
            <div className="text-base font-semibold text-ink">Repository management is staged for backend work</div>
            <p className="mt-2 text-sm leading-6 text-soft">
              {/* TODO: Backend integration required */}
              {/* TODO: Endpoint not available for multi-repository CRUD or sync preferences */}
              The UI is preserved here, but add/remove/sync controls stay disabled until the backend exposes repository settings endpoints.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
