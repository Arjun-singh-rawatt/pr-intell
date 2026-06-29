// PATH: pr-intel/backend/src/services/aiRouter.js

import { isConfiguredEnv } from '../utils/env.js';

class RateLimitError extends Error {
  constructor(provider) {
    super(`Rate limit: ${provider}`);
    this.isRateLimit = true;
    this.provider = provider;
  }
}

// ── Provider list — Gemini first ──────────────────────────────────────────

const FREE_PROVIDERS = [
  {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    envKey: 'GEMINI_API_KEY',
    async call(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.3 },
        }),
      });
      if (res.status === 429) throw new RateLimitError('gemini-flash');
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`);
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini returned empty response');
      return text.trim();
    },
  },
  {
    id: 'gemini-lite',
    name: 'Gemini Flash-Lite',
    envKey: 'GEMINI_API_KEY',  // same key, different model
    async call(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.3 },
        }),
      });
      if (res.status === 429) throw new RateLimitError('gemini-lite');
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Gemini Lite ${res.status}: ${body.slice(0, 200)}`);
      }
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Gemini Lite returned empty response');
      return text.trim();
    },
  },
  {
    id: 'groq',
    name: 'Groq (Llama 3.1 70B)',
    envKey: 'GROQ_API_KEY',
    async call(prompt, apiKey) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 1200,
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (res.status === 429) throw new RateLimitError('groq');
      if (!res.ok) throw new Error(`Groq ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content.trim();
    },
  },
  {
    id: 'openrouter-deepseek',
    name: 'DeepSeek R1 (OpenRouter)',
    envKey: 'OPENROUTER_API_KEY',
    async call(prompt, apiKey) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/your-username/pr-intel',
          'X-Title': 'PR Intel',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          max_tokens: 1200,
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (res.status === 429) throw new RateLimitError('openrouter-deepseek');
      if (!res.ok) throw new Error(`OpenRouter DeepSeek ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content.trim();
    },
  },
  {
    id: 'openrouter-llama',
    name: 'Llama 3.1 8B (OpenRouter)',
    envKey: 'OPENROUTER_API_KEY',
    async call(prompt, apiKey) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/your-username/pr-intel',
          'X-Title': 'PR Intel',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.1-8b-instruct:free',
          max_tokens: 1200,
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (res.status === 429) throw new RateLimitError('openrouter-llama');
      if (!res.ok) throw new Error(`OpenRouter Llama ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content.trim();
    },
  },
  {
    id: 'openrouter-qwen',
    name: 'Qwen 2.5 7B (OpenRouter)',
    envKey: 'OPENROUTER_API_KEY',
    async call(prompt, apiKey) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/your-username/pr-intel',
          'X-Title': 'PR Intel',
        },
        body: JSON.stringify({
          model: 'qwen/qwen-2.5-7b-instruct:free',
          max_tokens: 1200,
          temperature: 0.3,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (res.status === 429) throw new RateLimitError('openrouter-qwen');
      if (!res.ok) throw new Error(`OpenRouter Qwen ${res.status}`);
      const data = await res.json();
      return data.choices[0].message.content.trim();
    },
  },
];

const OLLAMA = {
  id: 'ollama',
  async call(prompt) {
    const host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    const model = process.env.OLLAMA_MODEL || 'llama3.2';
    const res = await fetch(`${host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false, options: { num_predict: 1200 } }),
    });
    if (!res.ok) throw new Error(`Ollama ${res.status} — is Ollama running?`);
    const data = await res.json();
    return data.response.trim();
  },
};

// ── Router state ──────────────────────────────────────────────────────────

const exhaustedUntil = new Map();
const COOLDOWN = 60 * 60 * 1000; // 1 hour

function isExhausted(id) {
  return Date.now() < (exhaustedUntil.get(id) || 0);
}

function markExhausted(id) {
  exhaustedUntil.set(id, Date.now() + COOLDOWN);
  console.warn(`[router] ${id} exhausted — cooling down 1hr`);
}

export function getRouterStatus() {
  return {
    providers: FREE_PROVIDERS.map((p) => ({
      id: p.id,
      name: p.name,
      configured: isConfiguredEnv(p.envKey),
      exhausted: isExhausted(p.id),
    })),
    ollama: {
      host: process.env.OLLAMA_HOST || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama3.2',
    },
  };
}

export async function routePrompt(prompt) {
  const available = FREE_PROVIDERS.filter(
    (p) => isConfiguredEnv(p.envKey) && !isExhausted(p.id)
  );

  for (const provider of available) {
    const apiKey = process.env[provider.envKey]?.trim();
    try {
      console.log(`[router] Trying ${provider.name}`);
      const text = await provider.call(prompt, apiKey);
      console.log(`[router] ✓ ${provider.name}`);
      return { text, provider: provider.id };
    } catch (err) {
      if (err.isRateLimit) {
        markExhausted(provider.id);
        continue;
      }
      throw err;
    }
  }

  // All cloud providers exhausted — fall back to local Ollama
  console.log('[router] All providers exhausted — trying Ollama');
  try {
    const text = await OLLAMA.call(prompt);
    return { text, provider: 'ollama' };
  } catch (err) {
    throw new Error(
      `No AI provider available. Set GEMINI_API_KEY in backend/.env (free at aistudio.google.com). Ollama error: ${err.message}`
    );
  }
}