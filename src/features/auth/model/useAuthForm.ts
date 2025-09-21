'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { FirebaseError } from 'firebase/app';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase';
import { useT } from '@/hooks/useT';
import { authSchema } from '@/entities/user/lib/validators';
import { AuthFormData } from '@/entities/user/model/types';
import { signIn, signUp, resetPassword } from '../lib/auth';
import { mapAuthErr } from '../lib/mapAuthError';

export function useAuthForm(mode: 'sign-in' | 'sign-up') {
  const { t } = useT();
  const router = useRouter();
  const sp = useSearchParams();
  const redirectTo = sp.get('redirectTo') || '/';

  const [ready, setReady] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const schema = useMemo(() => authSchema(t), [t]);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) router.replace(redirectTo);
      else setReady(true);
    });
    return () => unsub();
  }, [router, redirectTo]);

  async function onSubmit(data: AuthFormData) {
    setSubmitError(null);
    setInfoMessage(null);
    try {
      if (mode === 'sign-in') await signIn(data.email, data.password);
      else await signUp(data.email, data.password);
      router.replace(redirectTo);
    } catch (err: unknown) {
      let code = 'auth/error';
      if (err instanceof FirebaseError) code = err.code;
      setSubmitError(mapAuthErr(code));
    }
  }

  async function onForgotPassword() {
    setSubmitError(null);
    setInfoMessage(null);
    const email = form.getValues('email');
    if (!email) {
      setSubmitError(t('enter_email_reset'));
      return;
    }
    try {
      await resetPassword(email);
      setInfoMessage(t('reset_link_sent'));
    } catch (err: unknown) {
      let code = 'auth/error';
      if (err instanceof FirebaseError) code = err.code;
      setSubmitError(mapAuthErr(code));
    }
  }

  return {
    t,
    form,
    ready,
    passwordHidden,
    setPasswordHidden,
    submitError,
    infoMessage,
    onSubmit,
    onForgotPassword,
    mode,
  };
}
