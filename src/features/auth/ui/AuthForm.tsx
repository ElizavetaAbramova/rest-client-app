'use client';

import { Suspense } from 'react';
import { FormProvider } from 'react-hook-form';
import { useAuthForm } from '../model/useAuthForm';
import { EmailField } from './parts/EmailField';
import { PasswordField } from './parts/PasswordField';
import { FormStatus } from './parts/FormStatus';

export default function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const {
    t,
    form,
    ready,
    passwordHidden,
    setPasswordHidden,
    submitError,
    infoMessage,
    onSubmit,
    onForgotPassword,
    mode: currentMode,
  } = useAuthForm(mode);

  if (!ready) return null;

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const title =
    currentMode === 'sign-in' ? t('sign_in_title') : t('sign_up_title');
  const btnLabel = !isSubmitting
    ? title
    : currentMode === 'sign-in'
      ? t('signing_in')
      : t('creating_account');

  return (
    <Suspense>
      <div className="mx-auto w-full max-w-sm rounded-sm border border-slate-700 bg-slate-900 p-6">
        <h1 className="mb-4 text-center text-xl font-semibold">{title}</h1>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <EmailField />
            <PasswordField
              hidden={passwordHidden}
              toggle={() => setPasswordHidden((v) => !v)}
              onForgotPassword={onForgotPassword}
            />
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="btn btn-primary w-full rounded-sm disabled:opacity-50"
              aria-label={mode === 'sign-in' ? 'sign in' : 'sign up'}
            >
              {btnLabel}
            </button>
            <FormStatus error={submitError} info={infoMessage} />
          </form>
        </FormProvider>
      </div>
    </Suspense>
  );
}
