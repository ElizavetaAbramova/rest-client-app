'use client';

import { useFormContext } from 'react-hook-form';
import { AuthFormData } from '@/entities/user/model/types';
import { useAuthForm } from '../../model/useAuthForm';

export function PasswordField({
  hidden,
  toggle,
  onForgotPassword,
}: {
  hidden: boolean;
  toggle: () => void;
  onForgotPassword: () => void;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<AuthFormData>();
  const { t, mode } = useAuthForm('sign-in');

  return (
    <div>
      <label htmlFor="password" className="sr-only">
        {t('password')}
      </label>
      <div className="flex gap-2">
        <input
          id="password"
          {...register('password')}
          type={hidden ? 'password' : 'text'}
          placeholder={t('password_placeholder')}
          autoComplete={
            mode === 'sign-in' ? 'current-password' : 'new-password'
          }
          className="input input-bordered w-full"
          aria-invalid={!!errors.password}
        />
        <button
          type="button"
          className="btn btn-ghost rounded-sm"
          onClick={toggle}
        >
          {hidden ? t('show') : t('hide')}
        </button>
      </div>
      {errors.password && (
        <p className="mt-1 text-sm text-red-400">{t('password_rules')}</p>
      )}
      <div className="mt-1">
        <button
          type="button"
          className="btn btn-link px-0 text-sm"
          onClick={onForgotPassword}
          aria-label="forgot password"
        >
          {t('forgot_password')}
        </button>
      </div>
    </div>
  );
}
