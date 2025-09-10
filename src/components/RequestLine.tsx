'use client';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useT } from '@/hooks/useT';

const methods = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
] as const;
type Method = (typeof methods)[number];

const enc = (s: string) =>
  btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const setHash = (
  m: Method,
  u: string,
  b: string,
  h: Record<string, string>
) => {
  const parts = [
    `m=${enc(m)}`,
    u ? `u=${enc(u)}` : '',
    b ? `b=${enc(b)}` : '',
    Object.keys(h).length ? `h=${enc(JSON.stringify(h))}` : '',
  ].filter(Boolean);
  location.hash = parts.join('&');
};

const isValidUrl = (s: string) => {
  try {
    new URL(s);
  } catch {
    return false;
  }
  return true;
};

export default function RequestLine() {
  const { t } = useT();
  const [method, setMethod] = useState<Method>('GET');
  const [url, setUrl] = useState('');
  const [body] = useState('');
  const [headers] = useState<Record<string, string>>({});

  const onChangeMethod = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as Method;
    setMethod(v);
    setHash(v, url, body, headers);
  };

  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setUrl(v);
    setHash(method, v, body, headers);
  };

  const onSend = () => {
    setHash(method, url, body, headers);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('requestline:send'));
    }, 0);
  };

  const onUrlKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValidUrl(url))
      onSend();
  };

  const onShare = () => {
    navigator.clipboard.writeText(location.href);
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <select
        value={method}
        onChange={onChangeMethod}
        className="select select-bordered w-full md:w-40"
      >
        {methods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <input
        value={url}
        onChange={onChangeUrl}
        onKeyDown={onUrlKey}
        placeholder={t('url_placeholder')}
        className="input input-bordered w-full"
      />
      <button
        className="btn btn-primary rounded-sm md:ml-2"
        onClick={onSend}
        disabled={!isValidUrl(url)}
      >
        {t('send')}
      </button>
      <button className="btn btn-outline rounded-sm md:ml-2" onClick={onShare}>
        {t('share')}
      </button>
    </div>
  );
}
