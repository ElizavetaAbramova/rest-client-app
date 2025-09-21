'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useT } from '@/hooks/useT';
import { useRouter } from 'next/navigation';
import { useVariables } from '@/hooks/useVariables';

export default function HeavyPageImpl() {
  const { t } = useT();
  const router = useRouter();
  const { variables, addVariable, removeVariable } = useVariables();
  const [loading, setLoading] = useState(true);

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        return;
      }
      setLoading(false);
    });
    return unsub;
  }, [router]);

  const handleAdd = () => {
    if (!newKey.trim()) return;
    addVariable(newKey.trim(), newValue);
    setNewKey('');
    setNewValue('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center md:m-[150px]">
        <p className="text-2xl">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="vars-page bg-base-300 flex h-dvh flex-col items-center gap-5 p-5">
      <h1 className="text-3xl font-bold">{t('variables')}</h1>

      {Object.keys(variables).length === 0 ? (
        <p className="text-gray-500">{t('no_variables')}</p>
      ) : (
        <table className="table w-full max-w-2xl">
          <thead>
            <tr>
              <th className="text-left">{t('name')}</th>
              <th className="text-left">{t('value')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="">
            {Object.entries(variables).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-800">
                <td className="font-mono">{key}</td>
                <td className="font-mono">{value}</td>
                <td>
                  <button
                    className="btn btn-sm btn-error absolute right-0"
                    onClick={() => removeVariable(key)}
                  >
                    {t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-5 flex w-full max-w-2xl flex-col gap-2 md:flex-row">
        <input
          className="input input-bordered flex-1"
          placeholder={t('variable_name')}
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <input
          className="input input-bordered flex-1"
          placeholder={t('variable_value')}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          {t('add')}
        </button>
      </div>
    </div>
  );
}
