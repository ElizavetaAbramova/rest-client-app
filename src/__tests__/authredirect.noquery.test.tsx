import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import AuthRedirect from '@/components/AuthRedirect';
import * as nav from 'next/navigation';

function roParamsEmpty(): ReturnType<typeof nav.useSearchParams> {
  const usp = new URLSearchParams();
  return {
    get: usp.get.bind(usp),
    getAll: usp.getAll.bind(usp),
    has: usp.has.bind(usp),
    toString: usp.toString.bind(usp),
    entries: usp.entries.bind(usp),
    forEach: usp.forEach.bind(usp),
    keys: usp.keys.bind(usp),
    values: usp.values.bind(usp),
    [Symbol.iterator]: usp[Symbol.iterator].bind(usp),
  } as unknown as ReturnType<typeof nav.useSearchParams>;
}

beforeEach(() => vi.restoreAllMocks());

describe('AuthRedirect no query', () => {
  it('redirects with pathname only', async () => {
    vi.spyOn(nav, 'usePathname').mockReturnValue('/client');
    vi.spyOn(nav, 'useSearchParams').mockReturnValue(roParamsEmpty());
    const router = nav.useRouter() as unknown as {
      replace: (url: string) => void;
    };
    render(<AuthRedirect />);
    await waitFor(() => expect(router.replace).toHaveBeenCalled());
    expect(router.replace).toHaveBeenCalledWith(
      '/auth/sign-in?redirectTo=%2Fclient'
    );
  });
});
