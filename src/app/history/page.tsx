'use client';
import dynamic from 'next/dynamic';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';

const History = dynamic(() => import('../../components/HistoryAnalytics'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function HistoryPage() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      //TODO: delete console log
      console.log(user?.uid);
      setUserId(user ? user.uid : '');
    });
  }, []);

  return (
    <div className="history-page bg-base-300 min-h-screen p-5 text-center">
      {userId === '' ? (
        <p>Login to see the history</p>
      ) : (
        <History userId={userId} />
      )}
    </div>
  );
}
