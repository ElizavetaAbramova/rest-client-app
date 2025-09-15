import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export function renderWithI18n(ui: ReactNode) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}
export const enc = (s: string) =>
  btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

export function makeHash({
  method = 'GET',
  url = '',
  body = '',
  headers = [],
}: {
  method?: string;
  url?: string;
  body?: string;
  headers?: Array<{ k: string; v: string }>;
}) {
  const m = enc(method);
  const u = url ? enc(url) : '';
  const b = body ? enc(body) : '';
  const h = headers.length ? enc(JSON.stringify(headers)) : '';
  return [
    m ? `m=${m}` : '',
    u ? `u=${u}` : '',
    b ? `b=${b}` : '',
    h ? `h=${h}` : '',
  ]
    .filter(Boolean)
    .join('&');
}
