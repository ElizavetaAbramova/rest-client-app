'use client';
import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import { useT } from '@/hooks/useT';
import { setHashParam, getHashParam } from '@/utils/hashParams';
import { decodeBase64Url } from '@/utils/base64url';

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
  const debRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const mEnc = getHashParam('m');
      const uEnc = getHashParam('u');
      if (mEnc) {
        try {
          setMethod(decodeBase64Url(mEnc).toUpperCase() as Method);
        } catch (e) {
          console.error(e);
        }
      }
      if (uEnc) {
        try {
          setUrl(decodeBase64Url(uEnc));
        } catch (e) {
          console.error(e);
        }
      }
    } catch (e){
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const onHash = () => {
      try {
        const mEnc = getHashParam('m');
        const uEnc = getHashParam('u');
        if (mEnc) {
          try {
            setMethod(decodeBase64Url(mEnc).toUpperCase() as Method);
          } catch (e){
            console.error(e);
          }
        }
        if (uEnc) {
          try {
            setUrl(decodeBase64Url(uEnc));
          } catch (e){
            console.error(e);
          }
        }
      } catch (e){
        console.error(e);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const onChangeMethod = (e: ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as Method;
    setMethod(v);
    setHashParam('m', enc(v));
  };

  const saveUrlNow = (v: string) => {
    setHashParam('u', enc(v));
  };

  const onChangeUrl = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setUrl(v);
    if (debRef.current) window.clearTimeout(debRef.current);
    debRef.current = window.setTimeout(() => {
      saveUrlNow(v);
      debRef.current = null;
    }, 400);
  };

  const onSend = () => {
    window.dispatchEvent(new CustomEvent('body:flush'));
    saveUrlNow(url);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('requestline:send'));
    }, 0);
  };

  const onUrlKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isValidUrl(url)) {
      onSend();
    }
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
