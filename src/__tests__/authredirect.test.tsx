import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import AuthRedirect from '@/components/AuthRedirect';
import * as nav from 'next/navigation';

function makeReadonlySearchParams(qs: string) {
  const usp = new URLSearchParams(qs);
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

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('AuthRedirect', () => {
  it('redirects to sign-in with redirectTo=current', async () => {
    vi.spyOn(nav, 'usePathname').mockReturnValue('/history' as string);

    vi.spyOn(nav, 'useSearchParams').mockReturnValue(
      makeReadonlySearchParams('q=1')
    );
    const router = nav.useRouter() as unknown as {
      replace: (url: string) => void;
    };
    render(<AuthRedirect />);
    await waitFor(() => expect(router.replace).toHaveBeenCalled());
    expect(router.replace).toHaveBeenCalledWith(
      '/auth/sign-in?redirectTo=%2Fhistory%3Fq%3D1'
    );
  });
});
