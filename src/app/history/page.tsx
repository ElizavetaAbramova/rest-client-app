'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import HistoryAnalytics from '@/components/HistoryAnalytics';
import { useT } from '@/hooks/useT';
import { HistoryAnalyticsItem } from '../../../types/HistoryAnalyticsProps';
import { useRouter } from 'next/navigation';
import EmptyHistory from '@/components/EmptyHistory';
import { fetchHistory } from '@/utils/fetchHistory';

export default function HistoryPage() {
  const { t } = useT();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requestsHistory, setRequestsHistory] = useState<
    HistoryAnalyticsItem[]
  >([]);
  const tableHeaders = [
    t('request_time'),
    t('method'),
    t('endpoint'),
    t('response_status'),
    `${t('response_time')} (${t('ms')})`,
    `${t('response_size')} (${t('bytes')})`,
    t('error_details'),
  ];

  async function requestHistory(id: string) {
    try {
      const data = await fetchHistory(id);
      setRequestsHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        requestHistory(user.uid);
      }
    });
  }, []);

  const navigator = (route: string) => {
    router.push(route);
  };

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center md:m-[150px]">
          <p className="text-2xl">{t('loading_history')}</p>
        </div>
      )}
      {!loading && requestsHistory.length === 0 && (
        <EmptyHistory
          onClickNavigator={navigator}
          header={t('empty_history')}
          text={t('empty_history_text')}
          clickLabel={t('client')}
          varLabel={t('variables')}
        />
      )}
      {!loading && requestsHistory.length !== 0 && (
        <div className="history-page bg-base-300 flex h-dvh flex-col items-center justify-start gap-5 p-5 text-center">
          <HistoryAnalytics
            history={requestsHistory}
            tableHeaders={tableHeaders}
            onClickNavigator={navigator}
          />
        </div>
      )}
    </>
  );
}
