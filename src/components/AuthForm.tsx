'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { PASSWORD_RE, mapAuthErr } from '@/constants/auth'
import { useT } from '@/hooks/useT'

type FormData = { email: string; password: string }

export default function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const { t } = useT()
  const router = useRouter()
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().email({ message: t('invalid_email') }),
        password: z.string().regex(PASSWORD_RE, t('password_rules')),
      }),
    [t]
  )

  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) router.replace('/')
      else setReady(true)
    })
    return () => unsub()
  }, [router])

  const title = useMemo(() => (mode === 'sign-in' ? t('sign_in_title') : t('sign_up_title')), [mode, t])
  const btnLabel = useMemo(
    () => (!isSubmitting ? title : mode === 'sign-in' ? t('signing_in') : t('creating_account')),
    [isSubmitting, mode, title, t]
  )

  async function onSubmit(data: FormData) {
    setSubmitError(null)
    setInfoMessage(null)
    try {
      if (mode === 'sign-in') {
        await signInWithEmailAndPassword(auth, data.email, data.password)
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password)
      }
      router.replace('/')
    } catch (err: unknown) {
      let code = 'auth/error'
      if (err instanceof FirebaseError) code = err.code
      const message = mapAuthErr(code)
      setSubmitError(message)
    }
  }

  async function onForgotPassword() {
    setSubmitError(null)
    setInfoMessage(null)
    const email = getValues('email')
    if (!email) {
      setSubmitError(t('enter_email_reset', 'Enter your email to reset password.'))
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setInfoMessage(t('reset_link_sent', 'Password reset link sent to your email.'))
    } catch (err: unknown) {
      let code = 'auth/error'
      if (err instanceof FirebaseError) code = err.code
      const message = mapAuthErr(code)
      setSubmitError(message)
    }
  }

  if (!ready) return null

  return (
    <div className="mx-auto w-full max-w-sm p-6 rounded-sm border border-slate-700 bg-slate-900">
      <h1 className="text-xl font-semibold mb-4 text-center">{title}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" aria-describedby="form-status">
        <div>
          <label htmlFor="email" className="sr-only">{t('email')}</label>
          <input
            id="email"
            {...register('email')}
            type="email"
            placeholder={t('email_placeholder')}
            autoComplete="email"
            className="input input-bordered w-full"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">{t('password')}</label>
          <div className="flex gap-2">
            <input
              id="password"
              {...register('password')}
              type={passwordHidden ? 'password' : 'text'}
              placeholder={t('password_placeholder')}
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              className="input input-bordered w-full"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              className="btn btn-ghost rounded-sm"
              onClick={() => setPasswordHidden(v => !v)}
              aria-label={passwordHidden ? 'show password' : 'hide password'}
            >
              {passwordHidden ? t('show') : t('hide')}
            </button>
          </div>
          {errors.password && <p id="password-error" className="text-sm text-red-400 mt-1">{t('password_rules')}</p>}
          <div className="mt-1">
            <button type="button" className="btn btn-link text-sm px-0" onClick={onForgotPassword} aria-label="forgot password">
              {t('forgot_password')}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="btn btn-primary rounded-sm w-full disabled:opacity-50"
          aria-busy={isSubmitting}
          aria-label={mode === 'sign-in' ? 'sign in' : 'sign up'}
        >
          {btnLabel}
        </button>
        <div id="form-status" className="min-h-5">
          {submitError && <p className="text-sm text-red-400">{submitError}</p>}
          {infoMessage && <p className="text-sm text-emerald-400">{infoMessage}</p>}
        </div>
      </form>
    </div>
  )
}
