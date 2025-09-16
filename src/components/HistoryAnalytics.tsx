'use client';

import { useT } from '@/hooks/useT';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function HistoryAnalytics({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);
  const [requestsHistory, setRequestsHistory] = useState([]);
  const [message, setMessage] = useState('');
  const { t } = useT();

  useEffect(() => {
    async function fetchHistory() {
      try {
        // const res = await fetch(`/api/requests/${userId}`);
        const res = await fetch('/api/requests/5mpBJizQyNbhVGRiAzTrwJNroPh2');
        const data = await res.json();
        console.log(data, userId);
        setRequestsHistory(data.requests || []);
        setMessage(data.message || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      {loading && <p className="text-2xl">Loading history...</p>}
      {message && <h2 className="text-2xl">{message}</h2>}
      {!loading && requestsHistory.length === 0 && (
        <div className="buttons flex gap-3">
          <Link href="/client" className="btn btn-soft btn-primary rounded-sm">
            {t('client')}
          </Link>
          <Link
            href="/variables"
            className="btn btn-soft btn-primary rounded-sm"
          >
            {t('variables')}
          </Link>
        </div>
      )}
      {!loading && requestsHistory && (
        <div>
          History : <p>{requestsHistory.length}</p>
        </div>
      )}
    </div>
  );
}

export default HistoryAnalytics;
// "5mpBJizQyNbhVGRiAzTrwJNroPh2"
