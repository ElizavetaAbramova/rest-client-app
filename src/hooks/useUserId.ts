import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function useUserId() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : '');
    });
  }, []);

  return { userId };
}
