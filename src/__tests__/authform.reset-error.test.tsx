import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithI18n } from './test-utils';
import AuthForm from '@/features/auth/ui/AuthForm';
import * as authLib from '@/features/auth/lib/auth';

vi.mock('@/features/auth/lib/auth', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  resetPassword: vi.fn(),
}));

describe('AuthForm password reset errors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders mapped error on reset failure', async () => {
    (
      authLib.resetPassword as unknown as import('vitest').Mock
    ).mockRejectedValueOnce({
      code: 'auth/invalid-email',
      message: 'Invalid email',
    });

    renderWithI18n(<AuthForm mode="sign-in" />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'a@b.c' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'forgot password' }));

    const errs = await screen.findAllByText(/invalid|error/i);
    expect(errs.length).toBeGreaterThan(0);
  });
});
