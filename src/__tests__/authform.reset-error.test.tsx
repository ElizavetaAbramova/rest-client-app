import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithI18n } from './test-utils';
import AuthForm from '@/components/AuthForm';
import { sendPasswordResetEmail } from 'firebase/auth';

vi.mock('@/lib/firebase', () => ({
  app: {},
  auth: {} as unknown,
  analytics: undefined,
}));

vi.mock('firebase/auth', async () => {
  const actual: typeof import('firebase/auth') =
    await vi.importActual('firebase/auth');
  return {
    ...actual,
    onAuthStateChanged: vi.fn((_, cb: (u: unknown) => void) => {
      cb(null);
      return () => {};
    }),
    sendPasswordResetEmail: vi.fn(),
  };
});

describe('AuthForm password reset errors', () => {
  it('renders mapped error on reset failure', async () => {
    (
      sendPasswordResetEmail as unknown as import('vitest').Mock
    ).mockRejectedValueOnce({
      code: 'auth/invalid-email',
      message: 'Invalid email',
    });

    renderWithI18n(<AuthForm mode="sign-in" />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'a@b.c' },
    });
    fireEvent.click(screen.getByRole('button', { name: /forgot password/i }));

    const errs = await screen.findAllByText(/invalid|error/i);
    expect(errs.length).toBeGreaterThan(0);
  });
});
