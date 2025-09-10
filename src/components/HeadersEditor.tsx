'use client';
import { useState, useEffect } from 'react';
import { setHashParam } from '@/utils/urlState';
import { decodeBase64Url } from '@/utils/base64url';
import { getHashParam } from '@/utils/hashParams';
import { useT } from '@/hooks/useT';

type Row = { k: string; v: string };

export default function HeadersEditor() {
  const { t } = useT();
  const [rows, setRows] = useState<Row[]>([{ k: '', v: '' }]);

  useEffect(() => {
    const h = getHashParam('h');
    if (!h) return;
    try {
      const parsed = JSON.parse(decodeBase64Url(h)) as Row[];
      if (Array.isArray(parsed) && parsed.length) setRows(parsed);
    } catch {
      setRows([{ k: '', v: '' }]);
    }
  }, []);

  const setK = (i: number, k: string) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, k } : row)));
  };
  const setV = (i: number, v: string) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, v } : row)));
  };
  const addRow = () => setRows((r) => [...r, { k: '', v: '' }]);
  const removeRow = (i: number) =>
    setRows((r) => r.filter((_, idx) => idx !== i));
  const apply = () => {
    const sanitized = rows.filter((r) => r.k.trim() !== '');
    setHashParam('h', JSON.stringify(sanitized));
  };
  const clearAll = () => {
    setRows([{ k: '', v: '' }]);
    setHashParam('h', '');
  };
  const resetFromHash = () => {
    const h = getHashParam('h');
    if (!h) {
      setRows([{ k: '', v: '' }]);
      return;
    }
    try {
      const parsed = JSON.parse(decodeBase64Url(h)) as Row[];
      setRows(parsed.length ? parsed : [{ k: '', v: '' }]);
    } catch {
      setRows([{ k: '', v: '' }]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-xl border">
        <table className="table-zebra table w-full">
          <thead>
            <tr>
              <th className="text-xs font-medium">{t('headers_name')}</th>
              <th className="text-xs font-medium">{t('headers_value')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="align-top">
                  <input
                    className="input input-bordered input-sm w/full"
                    value={row.k}
                    onChange={(e) => setK(i, e.target.value)}
                    placeholder="Content-Type"
                  />
                </td>
                <td className="align-top">
                  <input
                    className="input input-bordered input-sm w/full"
                    value={row.v}
                    onChange={(e) => setV(i, e.target.value)}
                    placeholder="application/json"
                  />
                </td>
                <td className="w-0 align-top">
                  <button
                    type="button"
                    className="btn btn-error btn-sm rounded-sm"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                  >
                    {t('remove')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn btn-outline btn-sm rounded-sm"
          onClick={addRow}
        >
          {t('headers_add')}
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm rounded-sm"
          onClick={apply}
        >
          {t('headers_apply')}
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm rounded-sm"
          onClick={clearAll}
        >
          {t('clear')}
        </button>
        <button
          type="button"
          className="btn btn-outline btn-sm rounded-sm"
          onClick={resetFromHash}
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
}
