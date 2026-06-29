import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext.jsx';
import {
  BellIcon,
  PaletteIcon,
  SaveIcon,
  CameraIcon,
  UserRoundIcon,
} from '../components/common/Icons.jsx';
import { Button, Panel, TextInput, Toggle } from '../components/common/UI.jsx';

export default function SettingsPage() {
  const { routerStatus, repository, feedItems, summaryCache, settings, saveSettings } = useAppData();
  const [draft, setDraft] = useState(settings);
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const providerSummary = useMemo(() => {
    const providers = routerStatus?.providers || [];
    const configured = providers.filter((provider) => provider.configured).length;
    const ready = providers.filter((provider) => provider.configured && !provider.exhausted).length;
    return { configured, ready };
  }, [routerStatus]);

  const stats = useMemo(() => {
    return {
      indexedPrs: feedItems.length,
      explained: Object.keys(summaryCache).length,
      repo: repository.fullName,
    };
  }, [feedItems.length, repository.fullName, summaryCache]);

  const updateField = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const discardChanges = () => {
    setDraft(settings);
  };

  const saveChanges = async () => {
    await saveSettings(draft);
    setSavedAt(new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    }));
  };

  const toggleAppearance = async () => {
    const nextDarkMode = !draft.darkMode;
    setDraft((current) => ({ ...current, darkMode: nextDarkMode }));
    await saveSettings({ darkMode: nextDarkMode });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-soft">
          Configure your public identity on the platform.
        </p>
        <h1 className="text-[28px] font-bold tracking-tight text-ink">Profile Settings</h1>
      </div>

      <Panel className="rounded-[12px] border border-line bg-panel p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[160px,1fr]">
          <div className="flex flex-col items-center">
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-[8px] border border-line bg-panel2 shadow-sm">
              <UserRoundIcon className="h-12 w-12 text-muted" />
              <button
                className="absolute -bottom-2 -right-2 rounded-full border border-line bg-panel p-2 shadow-sm transition-colors hover:bg-panel2"
                type="button"
              >
                <CameraIcon className="h-4 w-4 text-accent" />
              </button>
            </div>
            <span className="mt-4 block text-center text-[11px] font-semibold uppercase tracking-wider text-soft">
              AVATAR
            </span>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-soft">
                Display Name
              </span>
              <TextInput
                className="h-12 text-[14px]"
                onChange={(event) => updateField('displayName', event.target.value)}
                value={draft.displayName}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-soft">
                Username
              </span>
              <TextInput
                className="h-12 text-[14px]"
                onChange={(event) => updateField('username', event.target.value)}
                value={draft.username}
              />
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        <Panel className="flex items-center justify-between rounded-[12px] border border-line bg-panel p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-active">
              <PaletteIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-[16px] font-medium text-ink">Appearance</h3>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-soft">
                {draft.darkMode ? 'Dark mode enabled' : 'Light theme enabled'}
              </p>
            </div>
          </div>
          <button onClick={toggleAppearance} type="button">
            <Toggle checked={draft.darkMode} />
          </button>
        </Panel>

        <Panel className="flex items-center justify-between rounded-[12px] border border-line bg-panel p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-active">
              <BellIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-[16px] font-medium text-ink">Notifications</h3>
              <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-soft">
                Push alerts for contributors
              </p>
            </div>
          </div>
          <button onClick={() => updateField('notifications', !draft.notifications)} type="button">
            <Toggle checked={draft.notifications} />
          </button>
        </Panel>
      </div>

      <Panel className="space-y-5 rounded-[12px] border border-line bg-panel p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-semibold text-soft">System Status</h3>
              <span className="ml-2 inline-flex rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[12px] font-semibold text-success">
                system active
              </span>
              <span className="inline-flex rounded-full border border-line bg-panel2 px-2.5 py-0.5 text-[12px] font-semibold text-soft">
                v-2.4.0
              </span>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-soft">
              This settings screen now matches the flatter screenshot layout, while the live data below still reflects the current backend contract.
            </p>
          </div>
        </div>

        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          <div className="rounded-[8px] border border-line bg-nested p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-soft">
              providers ready
            </div>
            <div className="mt-1 text-[24px] font-bold text-ink">{providerSummary.ready}</div>
            <div className="mt-0.5 text-xs text-soft">{providerSummary.configured} configured</div>
          </div>
          <div className="rounded-[8px] border border-line bg-nested p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-soft">
              indexed prs
            </div>
            <div className="mt-1 text-[24px] font-bold text-ink">{stats.indexedPrs}</div>
            <div className="mt-0.5 text-xs text-soft">{stats.explained} explained</div>
          </div>
          <div className="rounded-[8px] border border-line bg-nested p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-soft">
              repository
            </div>
            <div className="mt-1 break-words text-[14px] font-semibold text-ink">{stats.repo}</div>
            <div className="mt-0.5 text-xs text-soft">read-only settings</div>
          </div>
        </div>
      </Panel>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          className="h-10 rounded-[12px] border border-red/30 bg-transparent px-4 text-red hover:bg-red/10 hover:text-red"
          type="button"
          variant="ghost"
        >
          Sign Out
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          {savedAt ? (
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              saved at {savedAt}
            </span>
          ) : null}
          <Button onClick={discardChanges} type="button" variant="ghost" className="h-10 rounded-[12px] px-4">
            Discard
          </Button>
          <Button onClick={saveChanges} type="button" className="h-10 rounded-[12px] px-4">
            <SaveIcon className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <p className="pt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        preferences sync to backend/data/store.json (local dev store)
      </p>
    </div>
  );
}
