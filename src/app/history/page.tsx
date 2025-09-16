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
  const [user, setUser] = useState<null | { email: string }>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (u) =>
      setUser(u ? { email: u.email || '' } : null)
    );
  }, []);

  return <div>{user && <History />}</div>;
}
