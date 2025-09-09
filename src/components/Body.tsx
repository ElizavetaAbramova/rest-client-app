'use client';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { encodeBase64Url, decodeBase64Url } from '@/utils/base64url';
import { getHashParam, setHashParam } from '@/utils/hashParams';

function bytesOf(text: string): number {
  return new Blob([text]).size;
}

function linesOf(text: string): number {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

function looksLikeJson(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const first = t[0];
  return first === '{' || first === '[';
}

export default function Body() {
  const [value, setValue] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const b = getHashParam('b');
    if (!b) return;
    try {
      setValue(decodeBase64Url(b));
    } catch {
      setValue('');
    }
  }, []);

  const sizeBytes = useMemo(() => bytesOf(value), [value]);
  const lineCount = useMemo(() => linesOf(value), [value]);
  const canPrettify = useMemo(() => looksLikeJson(value), [value]);

  const validationError = useMemo(() => {
    if (!mounted) return '';
    const t = value.trim();
    if (!t) return '';
    if (!looksLikeJson(t)) return '';
    try {
      JSON.parse(t);
      return '';
    } catch {
      return 'Not valid JSON. Use only double quotes (") and no trailing commas/semicolon.';
    }
  }, [mounted, value]);

  const handleBlur = useCallback(() => {
    const encoded = encodeBase64Url(value);
    setHashParam('b', encoded);
  }, [value]);

  const handlePrettify = useCallback(() => {
    try {
      const obj = JSON.parse(value);
      const pretty = JSON.stringify(obj, null, 2);
      setValue(pretty);
      taRef.current?.focus();
    } catch {
      const hints: string[] = [];
      if (/'\s*:/.test(value) || /:\s*'/.test(value))
        hints.push('Use only double quotes (").');
      if (/,(\s*[}\]])/.test(value))
        hints.push('Remove trailing comma before } or ].');
      if (/;\s*$/.test(value)) hints.push('Remove semicolon at the end.');
      alert('Not valid JSON.\n' + (hints.length ? hints.join('\n') : ''));
    }
  }, [value]);

  const shownBytes = mounted ? sizeBytes : 0;
  const shownLines = mounted ? lineCount : 0;
  const prettifyDisabled = !mounted || !canPrettify || !!validationError;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Body</label>
      <textarea
        ref={taRef}
        className={`min-h-56 w-full rounded-xl border p-3 font-mono text-sm ${validationError ? 'border-red-500 focus:ring-2 focus:ring-red-400 focus:outline-none' : ''}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Raw request body"
        aria-invalid={!!validationError}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrettify}
          disabled={prettifyDisabled}
          className="rounded-xl border px-3 py-1 text-sm disabled:opacity-50"
        >
          Prettify
        </button>
        <span className="text-xs opacity-70">{shownBytes} bytes</span>
        <span className="text-xs opacity-70">{shownLines} lines</span>
      </div>
      {validationError && (
        <span className="text-lg font-semibold text-red-700">
          {validationError}
        </span>
      )}
    </div>
  );
}
