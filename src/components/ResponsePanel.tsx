'use client';
import { useT } from '@/hooks/useT';

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

export default function ResponsePanel({
  resp,
  onShowAll,
  showAll,
}: {
  resp: RespData | null;
  onShowAll: () => void;
  showAll: boolean;
}) {
  const { t } = useT();
  if (!resp) return null;
  return (
    <div className="bg-base-100 rounded-xl border p-4">
      <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="text-sm">
          <div className="opacity-70">{t('response_status')}</div>
          <div
            className={
              resp.status >= 200 && resp.status < 300
                ? 'text-green-600'
                : 'text-red-600'
            }
          >
            {resp.status} {resp.statusText}
          </div>
        </div>
        <div className="text-sm">
          <div className="opacity-70">{t('response_time')}</div>
          <div>{resp.timeMs} ms</div>
        </div>
        <div className="text-sm">
          <div className="opacity-70">{t('response_size')}</div>
          <div>
            {resp.sizeBytes ?? 0} {t('bytes')}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="mb-2 text-sm opacity-70">{t('response_headers')}</div>
        <div className="overflow-x-auto">
          <table className="table-zebra table w-full">
            <thead>
              <tr>
                <th className="text-xs font-medium">{t('response_name')}</th>
                <th className="text-xs font-medium">{t('response_value')}</th>
              </tr>
            </thead>
            <tbody>
              {resp.headers.map(([k, v], i) => (
                <tr key={i}>
                  <td className="align-top text-xs">{k}</td>
                  <td className="align-top text-xs break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm opacity-70">{t('response_body')}</div>
        {!resp.isBinary && (
          <pre className="bg-base-200 max-h-[420px] overflow-auto rounded-lg border p-3 text-xs md:text-sm">
            {showAll ? resp.bodyFullText || resp.bodyText : resp.bodyText}
          </pre>
        )}
        {resp.isBinary && (
          <div className="text-sm">
            {t('response_binary_note')}
            {resp.downloadUrl && (
              <a href={resp.downloadUrl} download className="ml-2 underline">
                {t('response_download')}
              </a>
            )}
          </div>
        )}
        {!showAll && resp.truncated && !resp.isBinary && (
          <button
            type="button"
            onClick={onShowAll}
            className="btn btn-outline btn-sm mt-2 rounded-sm"
          >
            {t('response_show_all')}
          </button>
        )}
      </div>
    </div>
  );
}
