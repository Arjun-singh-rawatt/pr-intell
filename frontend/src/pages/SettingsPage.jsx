import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchUserKeys, saveUserKey, deleteUserKey, testUserKey } from '../api/auth.js';
import {
  BellIcon, PaletteIcon, SaveIcon, CpuIcon, KeyIcon, TrashIcon,
} from '../components/common/Icons.jsx';
import { Button, Panel, TextInput, Toggle } from '../components/common/UI.jsx';

const handleSwitch = () => {
  logout().then(() => {
    window.location.href = '/api/auth/github';
  });
};

// ── GitHubAvatar ──────────────────────────────────────
function GitHubAvatar({ user }) {
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.username}
        className="h-[112px] w-[112px] rounded-[8px] border border-line object-cover shadow-sm"
      />
    );
  }
  return (
    <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[8px] border border-line bg-panel2 shadow-sm">
      <span className="text-4xl text-muted">?</span>
    </div>
  );
}

// ── ApiKeyRow ─────────────────────────────────────────
const PROVIDERS = [
  { id: 'gemini',      label: 'Gemini (Google)',     placeholder: 'AIzaSy...' },
  { id: 'groq',        label: 'Groq',                placeholder: 'gsk_...' },
  { id: 'openrouter',  label: 'OpenRouter',          placeholder: 'sk-or-...' },
];

function ApiKeyRow({ provider, savedKey, onSave, onDelete, onTest }) {
  const [value, setValue]   = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true);
    try {
      await onSave(provider.id, value.trim());
      setValue('');
      setShowInput(false);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await onTest(provider.id);
      setTestResult(result);
    } catch (err) {
      setTestResult({ ok: false, detail: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="rounded-[8px] border border-line bg-nested p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CpuIcon className="h-4 w-4 text-accent" />
          <span className="text-[14px] font-semibold text-ink">{provider.label}</span>
          {savedKey && (
            <span className="rounded-full bg-success/10 border border-success/30 px-2 py-0.5 text-[11px] font-semibold text-success">
              configured
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedKey && (
            <>
              <button
                onClick={handleTest}
                disabled={testing}
                className="text-[12px] font-medium text-accent hover:underline disabled:opacity-50"
              >
                {testing ? 'Testing…' : 'Test'}
              </button>
              <button
                onClick={() => onDelete(provider.id)}
                className="text-muted hover:text-red transition-colors"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button
            onClick={() => setShowInput((v) => !v)}
            className="text-[12px] font-medium text-soft hover:text-ink"
          >
            {showInput ? 'Cancel' : savedKey ? 'Replace' : '+ Add Key'}
          </button>
        </div>
      </div>

      {savedKey && !showInput && (
        <p className="font-mono text-[12px] text-muted">{savedKey.maskedKey}</p>
      )}

      {showInput && (
        <div className="flex gap-2">
          <input
            type="password"
            placeholder={provider.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-10 flex-1 rounded-[8px] border border-line bg-panel2 px-3 font-mono text-[13px] text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
            autoComplete="off"
            spellCheck={false}
          />
          <Button onClick={handleSave} disabled={saving || !value.trim()} className="h-10 px-4 rounded-[8px]">
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      )}

      {testResult && (
        <p className={`text-[12px] font-medium ${testResult.ok ? 'text-success' : 'text-red'}`}>
          {testResult.ok ? '✓' : '✗'} {testResult.detail}
        </p>
      )}
    </div>
  );
}

function AuthBanner({ user, onLogout, onSwitch }) {
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    const handler = (e) => setJustLoggedIn(true);
    window.addEventListener('auth:loggedin', handler);
    return () => window.removeEventListener('auth:loggedin', handler);
  }, []);

  if (!user) return null;

  return (
    <div className={`rounded-[12px] border p-4 flex items-center justify-between gap-4 transition-all
      ${justLoggedIn
        ? 'border-success/40 bg-success/10'
        : 'border-line bg-panel'}`}>
      <div className="flex items-center gap-3">
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="h-10 w-10 rounded-full border border-line"
        />
        <div>
          {justLoggedIn && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-success mb-0.5">
              ✓ Signed in successfully
            </p>
          )}
          <p className="text-[14px] font-semibold text-ink">
            {user.displayName || user.username}
          </p>
          <p className="font-mono text-[12px] text-soft">@{user.username}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSwitch}
          className="text-[12px] font-medium text-soft hover:text-ink border border-line rounded-[8px] px-3 py-1.5 transition-colors"
        >
          Switch account
        </button>
        <button
          onClick={onLogout}
          className="text-[12px] font-medium text-red border border-red/30 rounded-[8px] px-3 py-1.5 hover:bg-red/10 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

// ── Main SettingsPage ─────────────────────────────────
export default function SettingsPage() {
  const { routerStatus, feedItems, summaryCache, settings, saveSettings } = useAppData();
  const { user, loading: authLoading, login, logout } = useAuth();

  const [draft, setDraft]   = useState(settings);
  const [savedAt, setSavedAt] = useState('');
  const [userKeys, setUserKeys] = useState([]);
  const [keysLoading, setKeysLoading] = useState(false);

  useEffect(() => { setDraft(settings); }, [settings]);

  // Load per-user API keys if logged in
  useEffect(() => {
    if (!user) { setUserKeys([]); return; }
    setKeysLoading(true);
    fetchUserKeys()
      .then(setUserKeys)
      .catch(() => setUserKeys([]))
      .finally(() => setKeysLoading(false));
  }, [user]);

  const providerSummary = useMemo(() => {
    const providers = routerStatus?.providers || [];
    return {
      configured: providers.filter(p => p.configured).length,
      ready: providers.filter(p => p.configured && !p.exhausted).length,
    };
  }, [routerStatus]);

  const stats = useMemo(() => ({
    indexedPrs: feedItems.length,
    explained:  Object.keys(summaryCache).length,
  }), [feedItems.length, summaryCache]);

  const updateField     = (key, value) => setDraft(c => ({ ...c, [key]: value }));
  const discardChanges  = () => setDraft(settings);
  const saveChanges     = async () => {
    await saveSettings(draft);
    setSavedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
  };
  const toggleAppearance = async () => {
    const next = !draft.darkMode;
    setDraft(c => ({ ...c, darkMode: next }));
    await saveSettings({ darkMode: next });
  };

  const handleSaveKey   = async (provider, key) => {
    await saveUserKey(provider, key);
    const updated = await fetchUserKeys();
    setUserKeys(updated);
  };
  const handleDeleteKey = async (provider) => {
    await deleteUserKey(provider);
    setUserKeys(k => k.filter(r => r.provider !== provider));
  };
  const handleTestKey   = (provider) => testUserKey(provider);

  return (
    <div className="space-y-6">
      <AuthBanner user={user} onLogout={logout} onSwitch={handleSwitch} />
      <div className="space-y-1">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-soft">
          Configure your identity and API keys.
        </p>
        <h1 className="text-[28px] font-bold tracking-tight text-ink">Settings</h1>
      </div>

      {/* ── Profile Panel ── */}
      <Panel className="rounded-[12px] border border-line bg-panel p-6 shadow-sm">
        {authLoading ? (
          <p className="text-sm text-soft">Loading profile…</p>
        ) : user ? (
          <div className="grid gap-6 lg:grid-cols-[160px,1fr]">
            <div className="flex flex-col items-center">
              <GitHubAvatar user={user} />
              <span className="mt-4 block text-center text-[11px] font-semibold uppercase tracking-wider text-soft">
                GitHub Avatar
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-soft">
                  Display Name
                </span>
                <p className="text-[16px] font-semibold text-ink">{user.displayName || user.username}</p>
              </div>
              <div>
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-soft">
                  GitHub Username
                </span>
                <p className="font-mono text-[14px] text-soft">@{user.username}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-[14px] text-soft">Sign in to save API keys and personalize your experience.</p>
            <Button onClick={login} className="h-10 gap-2 rounded-[12px] px-6">
              {/* GitHub mark */}
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Sign in with GitHub
            </Button>
          </div>
        )}
      </Panel>

      {/* ── API Keys Panel (only shown when logged in) ── */}
      {user && (
        <Panel className="rounded-[12px] border border-line bg-panel p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <KeyIcon className="h-5 w-5 text-accent" />
            <h2 className="text-[16px] font-semibold text-ink">Your AI Provider Keys</h2>
          </div>
          <p className="text-[13px] text-soft leading-relaxed">
            Keys are encrypted before storage and never exposed in full. Your keys are used first — 
            fallback to shared keys only if yours are unset.
          </p>
          {keysLoading ? (
            <p className="text-sm text-soft">Loading keys…</p>
          ) : (
            <div className="space-y-3">
              {PROVIDERS.map(p => (
                <ApiKeyRow
                  key={p.id}
                  provider={p}
                  savedKey={userKeys.find(k => k.provider === p.id) || null}
                  onSave={handleSaveKey}
                  onDelete={handleDeleteKey}
                  onTest={handleTestKey}
                />
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* ── Appearance + Notifications ── */}
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
          <button onClick={toggleAppearance} type="button"><Toggle checked={draft.darkMode} /></button>
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

      {/* ── System Status ── */}
      <Panel className="space-y-5 rounded-[12px] border border-line bg-panel p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <h3 className="text-[16px] font-semibold text-soft">System Status</h3>
          <span className="ml-2 inline-flex rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[12px] font-semibold text-success">
            system active
          </span>
          <span className="inline-flex rounded-full border border-line bg-panel2 px-2.5 py-0.5 text-[12px] font-semibold text-soft">
            v-2.5.0
          </span>
        </div>
        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          <div className="rounded-[8px] border border-line bg-nested p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-soft">providers ready</div>
            <div className="mt-1 text-[24px] font-bold text-ink">{providerSummary.ready}</div>
            <div className="mt-0.5 text-xs text-soft">{providerSummary.configured} configured</div>
          </div>
          <div className="rounded-[8px] border border-line bg-nested p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-soft">indexed prs</div>
            <div className="mt-1 text-[24px] font-bold text-ink">{stats.indexedPrs}</div>
            <div className="mt-0.5 text-xs text-soft">{stats.explained} explained · last 30 days</div>
          </div>
          <div className="rounded-[8px] border border-line bg-nested p-4 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-soft">repository</div>
            <div className="mt-1 break-words text-[14px] font-semibold text-ink">RocketChat/Rocket.Chat</div>
            <div className="mt-0.5 text-xs text-soft">read-only · KB stores full history</div>
          </div>
        </div>
      </Panel>

      {/* ── Footer actions ── */}
      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        {user ? (
          <Button
            onClick={logout}
            className="h-10 rounded-[12px] border border-red/30 bg-transparent px-4 text-red hover:bg-red/10"
            variant="ghost"
          >
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={login}
            className="h-10 rounded-[12px] px-4"
          >
            Sign in with GitHub
          </Button>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {savedAt && (
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">saved at {savedAt}</span>
          )}
          <Button onClick={discardChanges} type="button" variant="ghost" className="h-10 rounded-[12px] px-4">
            Discard
          </Button>
          <Button onClick={saveChanges} type="button" className="h-10 rounded-[12px] px-4">
            <SaveIcon className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}