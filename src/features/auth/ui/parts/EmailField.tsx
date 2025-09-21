'use client';

import { useFormContext } from 'react-hook-form';
import { AuthFormData } from '@/entities/user/model/types';
import { useAuthForm } from '../../model/useAuthForm';

export function EmailField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AuthFormData>();
  const { t } = useAuthForm('sign-in');

  return (
    <div>
      <label htmlFor="email" className="sr-only">
        {t('email')}
      </label>
      <input
        id="email"
        {...register('email')}
        type="email"
        placeholder={t('email_placeholder')}
        autoComplete="email"
        className="input input-bordered w-full"
        aria-invalid={!!errors.email}
      />
      {errors.email && (
        <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
      )}
    </div>
  );
}
