'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { decodeBase64Url } from '@/utils/base64url';
import { getHashParam } from '@/utils/hashParams';
import ResponsePanel from './ResponsePanel';
import { useT } from '@/hooks/useT';

type RespError = { code: string; message: string; hint?: string };
type RespData = {
  status: number;
  statusText: string;
  timeMs: number;
  sizeBytes: number | null;
  headers: Array<[string, string]>;
  isJson: boolean;
  isText: boolean;
  isBinary: boolean;
  truncated: boolean;
  bodyText: string;
  downloadUrl?: string;
  bodyFullText?: string;
};

const PREVIEW_LIMIT = 200 * 1024;
const TIMEOUT_MS = 15000;

type HeaderRow = { k?: unknown; v?: unknown };

export function parseHeaders(h: string | undefined): Record<string, string> {
  if (!h) return {};
  try {
    const parsed = JSON.parse(decodeBase64Url(h)) as unknown;
    const out: Record<string, string> = {};
    if (Array.isArray(parsed)) {
      for (const r of parsed as unknown[]) {
        const row = r as HeaderRow;
        const k = String(row.k ?? '').trim();
        const v = String(row.v ?? '');
        if (k) out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export default function RequestRunner() {
  const { t } = useT();
  const [resp, setResp] = useState<RespData | null>(null);
  const [err, setErr] = useState<RespError | null>(null);
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const [method, setMethod] = useState<string>('GET');
  const [url, setUrl] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [headersObj, setHeadersObj] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [stateWarn, setStateWarn] = useState<string | null>(null);
  const [urlTooLong, setUrlTooLong] = useState(false);

  useEffect(() => {
    try {
      const mEnc = getHashParam('m');
      const uEnc = getHashParam('u');
      const bEnc = getHashParam('b');
      const hEnc = getHashParam('h');
      const m = mEnc ? decodeBase64Url(mEnc).toUpperCase() : 'GET';
      setMethod(m);
      setUrl(uEnc ? decodeBase64Url(uEnc) : '');
      setBody(bEnc ? decodeBase64Url(bEnc) : '');
      setHeadersObj(parseHeaders(hEnc));
      setStateWarn(null);
    } catch {
      setStateWarn('Ignored invalid URL state');
    } finally {
      setReady(true);
      if (typeof window !== 'undefined')
        setUrlTooLong(window.location.href.length > 1800);
    }
  }, []);

  useEffect(() => {
    const onHash = () => {
      try {
        const mEnc = getHashParam('m');
        const uEnc = getHashParam('u');
        const bEnc = getHashParam('b');
        const hEnc = getHashParam('h');
        const m = mEnc ? decodeBase64Url(mEnc).toUpperCase() : 'GET';
        setMethod(m);
        setUrl(uEnc ? decodeBase64Url(uEnc) : '');
        setBody(bEnc ? decodeBase64Url(bEnc) : '');
        setHeadersObj(parseHeaders(hEnc));
        setStateWarn(null);
      } catch {
        setStateWarn('Ignored invalid URL state');
      } finally {
        if (typeof window !== 'undefined')
          setUrlTooLong(window.location.href.length > 1800);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const canSend = useMemo(
    () => ready && !!url && !!method,
    [ready, url, method]
  );

  const send = useCallback(async () => {
    if (!canSend || busy) return;
    setBusy(true);
    setErr(null);
    setResp(null);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const init: RequestInit = { method, signal: ac.signal, mode: 'cors' };
    if (Object.keys(headersObj).length) {
      init.headers = headersObj;
    }
    if (method !== 'GET' && method !== 'HEAD' && body) {
      init.body = body;
    }

    const t0 = performance.now();
    try {
      const to = setTimeout(() => ac.abort(), TIMEOUT_MS);
      let res: Response;
      try {
        res = await fetch(url, init);
      } finally {
        clearTimeout(to);
      }
      const t1 = performance.now();

      const headersArr = Array.from(res.headers.entries());
      const ct = res.headers.get('content-type') || '';
      const cl = res.headers.get('content-length');
      const isJson = /\bapplication\/json\b/i.test(ct);
      const isText =
        isJson ||
        /\b(text\/|application\/(xml|javascript|x-www-form-urlencoded))\b/i.test(
          ct
        );

      let isBinary = false;
      let bodyText = '';
      let buf: ArrayBuffer | null = null;

      if (isText) {
        try {
          bodyText = await res.text();
        } catch {
          isBinary = true;
        }
      } else {
        isBinary = true;
        buf = await res.arrayBuffer();
      }

      const size =
        typeof cl === 'string'
          ? Number(cl) || (buf ? buf.byteLength : bodyText.length)
          : buf
            ? buf.byteLength
            : bodyText.length;

      let pretty = bodyText;
      if (!isBinary) {
        try {
          const obj = JSON.parse(bodyText);
          pretty = JSON.stringify(obj, null, 2);
        } catch {
          void 0;
        }
      }

      const truncated = !showAll && !isBinary && pretty.length > PREVIEW_LIMIT;
      const preview = truncated
        ? pretty.slice(0, PREVIEW_LIMIT) + '\n…[truncated]'
        : pretty;

      let downloadUrl: string | undefined;
      if (isBinary && buf) {
        const blob = new Blob([buf]);
        downloadUrl = URL.createObjectURL(blob);
      }

      setResp({
        status: res.status,
        statusText: res.statusText,
        timeMs: Math.max(0, Math.round(t1 - t0)),
        sizeBytes: size,
        headers: headersArr,
        isJson,
        isText: !isBinary,
        isBinary,
        truncated,
        bodyText: isBinary ? '' : preview,
        downloadUrl,
        bodyFullText: isBinary ? '' : pretty,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (e instanceof DOMException && e.name === 'AbortError') {
        setErr({
          code: 'TIMEOUT',
          message: 'Request timed out',
          hint: `Try again or increase timeout (${TIMEOUT_MS}ms)`,
        });
      } else if (/Failed to fetch|NetworkError/i.test(msg)) {
        setErr({
          code: 'NETWORK',
          message: 'Network or CORS error',
          hint: 'Check URL, CORS headers, or try a public CORS-friendly endpoint',
        });
      } else {
        setErr({ code: 'ERROR', message: msg });
      }
    } finally {
      setBusy(false);
    }
  }, [busy, canSend, url, method, headersObj, body, showAll]);

  useEffect(() => {
    const handler = () => {
      const mEnc = getHashParam('m');
      const uEnc = getHashParam('u');
      const bEnc = getHashParam('b');
      const hEnc = getHashParam('h');
      const m = mEnc ? decodeBase64Url(mEnc).toUpperCase() : 'GET';
      setMethod(m);
      setUrl(uEnc ? decodeBase64Url(uEnc) : '');
      setBody(bEnc ? decodeBase64Url(bEnc) : '');
      setHeadersObj(parseHeaders(hEnc));
      setTimeout(() => send(), 0);
      if (typeof window !== 'undefined')
        setUrlTooLong(window.location.href.length > 1800);
    };
    window.addEventListener('requestline:send', handler);
    return () => window.removeEventListener('requestline:send', handler);
  }, [send]);

  return (
    <div className="mt-6 flex flex-col gap-3">
      {stateWarn && (
        <div className="text-xs text-amber-600">{t('invalid_url_state')}</div>
      )}
      {urlTooLong && (
        <div className="text-xs text-amber-600">{t('long_url_warning')}</div>
      )}
      <div className="flex items-center gap-2">
        {resp && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={
                resp.status >= 200 && resp.status < 300
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {resp.status} {resp.statusText}
            </span>
            <span>{resp.timeMs} ms</span>
            <span>{resp.sizeBytes ?? 0} bytes</span>
          </div>
        )}
        {err && (
          <div className="text-sm text-red-600">
            {err.message}
            {err.hint ? ` — ${err.hint}` : ''}
          </div>
        )}
      </div>
      <ResponsePanel
        resp={resp}
        onShowAll={() => setShowAll(true)}
        showAll={showAll}
      />
    </div>
  );
}
