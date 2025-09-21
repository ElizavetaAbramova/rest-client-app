import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { decodeBase64Url } from '@/utils/base64url';
import { RespData, RespError } from '@/entities/request/model/types';
import { readHashState } from '@/entities/request/lib/readHashState';
import { doRequest } from '@/features/RequestRunner/lib/doRequest';
import { useVariables } from '@/hooks/useVariables';
import { applyVariables } from '@/utils/replaceVariables';

export function useRequestRunner() {
  const [resp, setResp] = useState<RespData | null>(null);
  const [err, setErr] = useState<RespError | null>(null);
  const [busy, setBusy] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [body, setBody] = useState('');
  const [headersObj, setHeadersObj] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [stateWarn, setStateWarn] = useState<string | null>(null);
  const [urlTooLong, setUrlTooLong] = useState(false);

  const { variables } = useVariables();

  const applyHash = useCallback(() => {
    try {
      const state = readHashState();
      setMethod(state.method);
      setUrl(state.url);
      setBody(state.body);
      setHeadersObj(state.headersObj);
      setStateWarn(null);
    } catch {
      setStateWarn('Ignored invalid URL state');
    } finally {
      if (typeof window !== 'undefined')
        setUrlTooLong(window.location.href.length > 1800);
    }
  }, []);

  useEffect(() => {
    applyHash();
    setReady(true);
  }, [applyHash]);

  useEffect(() => {
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, [applyHash]);

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

    const finalUrl = applyVariables(url, variables) as string;

    const finalHeaders = Object.keys(headersObj).length
      ? (applyVariables(headersObj, variables) as Record<string, string>)
      : undefined;

    let finalBody: string | undefined;
    if (method !== 'GET' && method !== 'HEAD' && body) {
      try {
        const raw = decodeBase64Url(body);
        finalBody = applyVariables(raw, variables) as string;
      } catch {
        finalBody = applyVariables(body, variables) as string;
      }
    }

    const init: RequestInit = {
      method,
      signal: ac.signal,
      mode: 'cors',
      headers: finalHeaders,
      body: finalBody,
    };

    try {
      const res = await doRequest(finalUrl, init, showAll, ac);
      setResp(res);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (e instanceof DOMException && e.name === 'AbortError') {
        setErr({
          code: 'TIMEOUT',
          message: 'Request timed out',
          hint: `Try again or increase timeout`,
        });
      } else if (/Failed to fetch|NetworkError/i.test(msg)) {
        setErr({
          code: 'NETWORK',
          message: 'Network or CORS error',
          hint: 'Check URL or CORS headers',
        });
      } else {
        setErr({ code: 'ERROR', message: msg });
      }
    } finally {
      setBusy(false);
    }
  }, [busy, canSend, url, method, headersObj, body, showAll, variables]);

  useEffect(() => {
    const handler = () => {
      applyHash();
      setTimeout(() => send(), 0);
    };
    window.addEventListener('requestline:send', handler);
    return () => window.removeEventListener('requestline:send', handler);
  }, [applyHash, send]);

  return { resp, err, showAll, setShowAll, stateWarn, urlTooLong };
}
