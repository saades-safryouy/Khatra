const crypto = require('crypto');

const cache = new Map();
const MAX_CACHE = 4000;
const PROTECTED = [
  'NCHORBOHA KHAAATRA',
  'Khatra Market',
  'Coffee Shop',
  'Khatra',
  'KHATRA',
  'WhatsApp',
  'Instagram',
  'Facebook',
  'TikTok',
];

function cacheKey(text, source, target) {
  return crypto.createHash('sha1').update(`${source}|${target}|${text}`).digest('hex');
}

function remember(key, value) {
  if (cache.size >= MAX_CACHE) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
  cache.set(key, value);
  return value;
}

function protect(text) {
  let out = String(text);
  const tokens = [];
  PROTECTED.sort((a, b) => b.length - a.length).forEach((term, i) => {
    const token = `__KH${i}__`;
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (re.test(out)) {
      out = out.replace(re, token);
      tokens.push({ token, term });
    }
  });
  return { out, tokens };
}

function restore(text, tokens) {
  let out = String(text);
  tokens.forEach(({ token, term }) => {
    out = out.replace(new RegExp(token, 'g'), term);
  });
  return out;
}

async function translateWithDeepL(texts, source, target) {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return null;
  const endpoint = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2/translate';
  const body = new URLSearchParams();
  texts.forEach((t) => body.append('text', t));
  body.set('source_lang', source.toUpperCase() === 'FR' ? 'FR' : source.toUpperCase());
  body.set('target_lang', target.toUpperCase() === 'AR' ? 'AR' : target.toUpperCase());
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `DeepL-Auth-Key ${key}` },
    body,
  });
  if (!res.ok) throw new Error(`DeepL ${res.status}`);
  const data = await res.json();
  return (data.translations || []).map((t) => t.text);
}

async function translateWithMyMemory(text, source, target) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (!translated) throw new Error('MyMemory empty');
  return translated;
}

async function translateOne(text, source, target) {
  const raw = String(text || '').trim();
  if (!raw) return text;
  if (source === target) return text;
  const key = cacheKey(raw, source, target);
  if (cache.has(key)) return cache.get(key);

  const { out, tokens } = protect(raw);
  let translated;
  try {
    const deepl = await translateWithDeepL([out], source, target);
    translated = deepl ? deepl[0] : await translateWithMyMemory(out, source, target);
  } catch {
    try {
      translated = await translateWithMyMemory(out, source, target);
    } catch {
      return remember(key, raw);
    }
  }
  return remember(key, restore(translated, tokens));
}

async function translateMany(texts, source = 'fr', target = 'ar') {
  const list = Array.isArray(texts) ? texts.map((t) => String(t ?? '')) : [];
  const unique = [...new Set(list.filter((t) => t.trim()))];
  const map = {};
  const pending = [];
  unique.forEach((text) => {
    const key = cacheKey(text, source, target);
    if (cache.has(key)) map[text] = cache.get(key);
    else pending.push(text);
  });

  const BATCH = 4;
  for (let i = 0; i < pending.length; i += BATCH) {
    const slice = pending.slice(i, i + BATCH);
    const results = await Promise.all(slice.map((text) => translateOne(text, source, target)));
    slice.forEach((text, idx) => { map[text] = results[idx]; });
  }

  return list.map((text) => (text.trim() ? (map[text] || text) : text));
}

module.exports = { translateMany };
