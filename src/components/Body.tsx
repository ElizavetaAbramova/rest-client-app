'use client';
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import { decodeBase64Url } from '@/utils/base64url';
import { getHashParam } from '@/utils/hashParams';
import '@/lib/i18n';
import { useT } from '@/hooks/useT';
import * as jsonUtils from '@/features/body/lib/jsonUtils';

export default function Body({
  setBody,
  setRequestSize,
}: {
  setBody: (value: string) => void;
  setRequestSize: (size: number) => void;
}) {
  const { t } = useT();
  const [value, setValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const body = getHashParam('b');
    if (!body) return;
    try {
      const decoded = decodeBase64Url(body);
      setValue(decoded);
      setBody(decoded);
      setRequestSize(jsonUtils.bytesOf(decoded));
    } catch {
      setValue('');
    }
  }, []);

  const sizeBytes = useMemo(() => jsonUtils.bytesOf(value), [value]);
  const lineCount = useMemo(() => jsonUtils.linesOf(value), [value]);
  const canPrettify = useMemo(() => jsonUtils.looksLikeJson(value), [value]);

  const validationError = useMemo(() => {
    if (!mounted) return '';
    const trimmed = value.trim();
    if (!trimmed || !jsonUtils.looksLikeJson(trimmed)) return '';
    try {
      JSON.parse(trimmed);
      return '';
    } catch {
      return 'Not valid JSON. Use only double quotes (") and no trailing commas/semicolon.';
    }
  }, [mounted, value]);

  const handleBlur = useCallback(() => {
    jsonUtils.setHashParam('b', value);
    setBody(value);
    setRequestSize(jsonUtils.bytesOf(value));
    if (jsonUtils.looksLikeJson(value)) jsonUtils.ensureJsonContentType();
  }, [value]);

  const handlePrettify = useCallback(() => {
    try {
      setValue(JSON.stringify(JSON.parse(value), null, 2));
      taRef.current?.focus();
    } catch {
      const hints: string[] = [];
      if (/'\s*:/.test(value) || /:\s*'/.test(value))
        hints.push('Use only double quotes (").');
      if (/,(\s*[}\]])/.test(value))
        hints.push('Remove trailing comma before } or ].');
      if (/;\s*$/.test(value)) hints.push('Remove semicolon at the end.');
      alert('Not valid JSON.\n' + (hints.join('\n') || ''));
    }
  }, [value]);

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      window.dispatchEvent(new CustomEvent('requestline:send'));
    }
  };

  const shownBytes = mounted ? sizeBytes : 0;
  const shownLines = mounted ? lineCount : 0;
  const prettifyDisabled = !mounted || !canPrettify || !!validationError;

  return (
    <div className="flex w-full flex-col gap-2 md:w-1/2">
      <label className="text-sm font-medium">{t('body_label')}</label>
      <textarea
        ref={taRef}
        className={`min-h-56 w-full rounded-xl border p-3 font-mono text-sm ${
          validationError
            ? 'border-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none'
            : ''
        }`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKey}
        onBlur={handleBlur}
        placeholder={t('body_placeholder')}
        aria-invalid={!!validationError}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrettify}
          disabled={prettifyDisabled}
          className="rounded-xl border px-3 py-1 text-sm disabled:opacity-50"
        >
          {t('prettify')}
        </button>
        <span className="text-xs opacity-70">
          {shownBytes} {t('bytes')}
        </span>
        <span className="text-xs opacity-70">
          {shownLines} {t('lines')}
        </span>
      </div>
      {validationError && (
        <span className="text-lg font-semibold text-red-700">
          {validationError}
        </span>
      )}
    </div>
  );
}
