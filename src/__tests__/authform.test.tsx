import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthForm from '@/features/auth/ui/AuthForm';
import * as authLib from '@/features/auth/lib/auth';

vi.mock('@/features/auth/lib/auth', () => ({
  signIn: vi.fn(() => Promise.resolve()),
  signUp: vi.fn(() => Promise.resolve()),
  resetPassword: vi.fn(() => Promise.resolve()),
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates and signs in', async () => {
    render(<AuthForm mode="sign-in" />);
    const email = screen.getByPlaceholderText(/email/i);
    const pwd = screen.getByPlaceholderText(/password/i);
    const submit = screen.getByRole('button', { name: 'sign in' });
    expect(submit).toBeDisabled();
    fireEvent.change(email, { target: { value: 'user@example.com' } });
    fireEvent.change(pwd, { target: { value: 'Abcd123!' } });
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);
    await waitFor(() =>
      expect(authLib.signIn).toHaveBeenCalledWith(
        'user@example.com',
        'Abcd123!'
      )
    );
  });

  it('signs up', async () => {
    render(<AuthForm mode="sign-up" />);
    const email = screen.getByPlaceholderText(/email/i);
    const pwd = screen.getByPlaceholderText(/password/i);
    const submit = screen.getByRole('button', { name: 'sign up' });
    fireEvent.change(email, { target: { value: 'new@example.com' } });
    fireEvent.change(pwd, { target: { value: 'Abcd123!' } });
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);
    await waitFor(() =>
      expect(authLib.signUp).toHaveBeenCalledWith('new@example.com', 'Abcd123!')
    );
  });

  it('sends reset email', async () => {
    render(<AuthForm mode="sign-in" />);
    const email = screen.getByPlaceholderText(/email/i);
    fireEvent.change(email, { target: { value: 'user@example.com' } });
    const btn = screen.getByRole('button', { name: 'forgot password' });
    fireEvent.click(btn);
    await waitFor(() =>
      expect(authLib.resetPassword).toHaveBeenCalledWith('user@example.com')
    );
  });
});
