import { Toggle, Panel, Button } from '../common/UI.jsx';
import { ResetIcon, SaveIcon, WarningIcon } from '../common/Icons.jsx';

export default function PlaceholderSettingsPanel({ title, description, fields }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-soft">{description}</p>
      </div>

      <Panel className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <div key={field.label} className="rounded-2xl border border-white/8 bg-panel2/70 p-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-soft">{field.label}</div>
              {field.type === 'toggle' ? (
                <div className="mt-3">
                  <Toggle checked={field.value} disabled />
                </div>
              ) : (
                <input
                  className="mt-3 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-soft"
                  disabled
                  readOnly
                  value={field.value}
                />
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="border-dashed border-white/10 p-5">
        <div className="flex items-start gap-3">
          <WarningIcon className="mt-1 h-5 w-5 text-warn" />
          <div>
            <div className="text-base font-semibold text-ink">Waiting for backend preference endpoints</div>
            <p className="mt-2 text-sm leading-6 text-soft">
              {/* TODO: Backend integration required */}
              This settings surface is kept intact, but the project does not currently expose writable preference APIs for this section.
            </p>
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-3">
        <Button disabled>
          <SaveIcon className="h-4 w-4" />
          Save Changes
        </Button>
        <Button disabled variant="ghost">
          <ResetIcon className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
