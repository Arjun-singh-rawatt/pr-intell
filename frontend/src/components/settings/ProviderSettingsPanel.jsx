import { CpuIcon, PlugIcon, ResetIcon, SaveIcon, WarningIcon } from '../common/Icons.jsx';
import { Button, Panel, Pill, Toggle } from '../common/UI.jsx';

function ProviderCard({ provider }) {
  const tone = !provider.configured ? 'warn' : provider.exhausted ? 'warn' : 'success';
  const status = !provider.configured ? 'Missing API key' : provider.exhausted ? 'Cooling down' : 'Ready';

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-panel2 text-ink">
            <CpuIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-ink">{provider.name}</div>
            <div className="mt-1 text-sm text-soft">{status}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Pill tone={tone}>{provider.id}</Pill>
          <Toggle checked={provider.configured && !provider.exhausted} disabled />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-soft">api_key</span>
          <input
            className="h-11 w-full rounded-xl border border-white/10 bg-panel2 px-4 font-mono text-sm text-soft"
            disabled
            readOnly
            value={provider.configured ? 'Configured in backend environment' : 'Not configured'}
          />
        </label>
        <label className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-soft">cooldown_until</span>
          <input
            className="h-11 w-full rounded-xl border border-white/10 bg-panel2 px-4 font-mono text-sm text-soft"
            disabled
            readOnly
            value={provider.exhaustedUntil ? new Date(provider.exhaustedUntil).toLocaleString('en-IN') : 'Available now'}
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button disabled variant="outline">
          <PlugIcon className="h-4 w-4" />
          Test Connection
        </Button>
        <span className="text-xs text-soft">
          {/* TODO: Backend integration required */}
          No writable provider settings endpoint exists yet.
        </span>
      </div>
    </Panel>
  );
}

export default function ProviderSettingsPanel({ routerStatus }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink">AI_Providers</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-soft">
          Live provider health is coming from the existing backend router. Editing keys and models is still pending API support.
        </p>
      </div>

      {routerStatus?.providers?.length ? (
        <div className="space-y-4">
          {routerStatus.providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}

          <Panel className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-panel2 text-ink">
                <CpuIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold text-ink">Ollama fallback</div>
                <div className="mt-1 text-sm text-soft">
                  Host: {routerStatus.ollama?.host || 'http://localhost:11434'} · Model: {routerStatus.ollama?.model || 'llama3.2'}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      ) : (
        <Panel className="p-5">
          <div className="flex items-start gap-3">
            <WarningIcon className="mt-1 h-5 w-5 text-warn" />
            <div>
              <div className="text-base font-semibold text-ink">Router status unavailable</div>
              <p className="mt-2 text-sm leading-6 text-soft">
                The backend did not return provider state. Start the backend and refresh this page to see live status.
              </p>
            </div>
          </div>
        </Panel>
      )}

      <div className="flex flex-wrap gap-3">
        <Button disabled>
          <SaveIcon className="h-4 w-4" />
          Save Changes
        </Button>
        <Button disabled variant="ghost">
          <ResetIcon className="h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
