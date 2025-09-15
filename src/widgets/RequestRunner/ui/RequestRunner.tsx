'use client';
import { useRequestRunner } from '@/hooks/useRequestRunner';
import { useT } from '@/hooks/useT';
import ResponsePanel from '@/components/ResponsePanel';

const RequestRunner = () => {
  const { t } = useT();
  const { resp, err, showAll, setShowAll, stateWarn, urlTooLong } =
    useRequestRunner();

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
};

export default RequestRunner;
