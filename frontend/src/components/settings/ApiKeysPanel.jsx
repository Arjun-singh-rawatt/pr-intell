import { useEffect, useState } from 'react';
import { CpuIcon, SaveIcon, TrashIcon } from '../common/Icons.jsx';
import { Button, Panel, Pill, TextInput } from '../common/UI.jsx';
import { deleteKey, fetchKeyStatus, saveKey } from '../../api/keys.js';

const PROVIDERS = [
  { id: 'gemini', name: 'Gemini' },
  { id: 'groq', name: 'Groq' },
  { id: 'openrouter', name: 'OpenRouter' },
];

function ProviderKeyCard({ provider, status, onSave, onDelete }) {
  const [inputValue, setInputValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const configured = status?.configured;

  const handleSave = async () => {
    if (!inputValue.trim()) {
      setError('Enter a key first');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSave(provider.id, inputValue.trim());
      setInputValue('');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save key');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    setError('');
    try {
      await onDelete(provider.id);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to remove key');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-panel2 text-ink">
            <CpuIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-ink">{provider.name}</div>
            <div className="mt-1 text-sm text-soft">{configured ? 'Key stored (encrypted)' : 'No key stored'}</div>
          </div>
        </div>
        <Pill tone={configured ? 'success' : 'warn'}>{configured ? 'configured' : 'missing'}</Pill>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {configured ? (
          <>
            <div className="flex h-11 flex-1 min-w-[200px] items-center rounded-xl border border-white/10 bg-panel2 px-4 font-mono text-sm text-soft">
              {status.masked || '••••••••'}
            </div>
            <Button disabled={busy} onClick={handleDelete} variant="outline">
              <TrashIcon className="h-4 w-4" />
              Remove
            </Button>
          </>
        ) : (
          <>
            <TextInput
              className="h-11 flex-1 min-w-[200px] font-mono text-sm"
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={`Paste your ${provider.name} API key`}
              type="password"
              value={inputValue}
            />
            <Button disabled={busy} onClick={handleSave}>
              <SaveIcon className="h-4 w-4" />
              Save Key
            </Button>
          </>
        )}
      </div>

      {error ? <p className="mt-2 text-xs text-red">{error}</p> : null}
    </Panel>
  );
}

export default function ApiKeysPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchKeyStatus();
      setStatus(data);
    } catch (err) {
      setLoadError(
        err?.response?.status === 401
          ? 'Sign in with GitHub to manage your API keys.'
          : 'Could not load key status.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (providerId, apiKey) => {
    await saveKey(providerId, apiKey);
    await load();
  };

  const handleDelete = async (providerId) => {
    await deleteKey(providerId);
    await load();
  };

  return (
    <Panel className="space-y-4 p-6">
      <div>
        <h3 className="text-[16px] font-semibold text-ink">Your AI Provider Keys</h3>
        <p className="mt-1 text-sm text-soft">
          Keys are encrypted before storage and never exposed in full.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-soft">Loading key status...</p>
      ) : loadError ? (
        <div className="space-y-3">
          <p className="text-sm text-warn">{loadError}</p>
          <Button onClick={() => { window.location.href = '/api/auth/github'; }} type="button">
            Sign in with GitHub
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {PROVIDERS.map((provider) => (
            <ProviderKeyCard
              key={provider.id}
              onDelete={handleDelete}
              onSave={handleSave}
              provider={provider}
              status={status?.[provider.id]}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}