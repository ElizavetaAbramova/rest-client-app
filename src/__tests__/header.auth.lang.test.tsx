import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/widgets/Header';
import * as authMod from 'firebase/auth';

beforeEach(() => vi.restoreAllMocks());

function mockAuthState(user: authMod.User | null) {
  vi.spyOn(authMod, 'onAuthStateChanged').mockImplementation((a, observer) => {
    void a;
    if (typeof observer === 'function') observer(user);
    else observer?.next?.(user);
    return () => {};
  });
}

describe('Header auth and language', () => {
  it('guest shows sign_in/sign_up and can switch language', () => {
    mockAuthState(null);
    render(<Header />);
    expect(screen.getByRole('link', { name: /sign_in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign_up/i })).toBeInTheDocument();
    const lang = screen.getByRole('button', { name: /^en$/i });
    fireEvent.click(lang);
  });

  it('authed shows history/client and signs out', () => {
    mockAuthState({} as unknown as authMod.User);
    const signOutSpy = vi.spyOn(authMod, 'signOut').mockResolvedValue();
    render(<Header />);
    expect(screen.getByRole('link', { name: /history/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /client/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /sign_out/i }));
    expect(signOutSpy).toHaveBeenCalled();
  });
});
