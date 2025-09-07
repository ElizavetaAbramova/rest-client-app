import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, cleanup, act } from '@testing-library/react'
import { useAuthExpiryRedirect } from '@/hooks/useAuthExpiryRedirect'

vi.useFakeTimers()

let savedCb: ((user: unknown) => unknown) | null = null
let unsubCalled = false

const replace = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}))

vi.mock('@/lib/firebase', () => ({
  auth: {},
}))

const getIdTokenResult = vi.fn()
const signOut = vi.fn().mockResolvedValue(undefined)
vi.mock('firebase/auth', () => ({
  onIdTokenChanged: (_auth: unknown, cb: (u: unknown) => unknown) => {
    savedCb = cb
    return () => {
      unsubCalled = true
    }
  },
  getIdTokenResult: (...args: unknown[]) => getIdTokenResult(...args),
  signOut: (...args: unknown[]) => signOut(...args),
}))

function Harness() {
  useAuthExpiryRedirect()
  return null
}

describe('useAuthExpiryRedirect', () => {
  beforeEach(() => {
    cleanup()
    savedCb = null
    unsubCalled = false
    replace.mockClear()
    getIdTokenResult.mockReset()
    signOut.mockClear()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.useFakeTimers()
    vi.setSystemTime(new Date(0))
  })

  it('redirects immediately when user is null', async () => {
    render(<Harness />)
    await act(async () => {
      await savedCb?.(null)
    })
    expect(replace).toHaveBeenCalledWith('/')
  })

  it('schedules signOut at token expiry plus skew, then redirects', async () => {
    const now = new Date('2025-01-01T00:00:00.000Z').getTime()
    vi.setSystemTime(new Date(now))
    getIdTokenResult.mockResolvedValue({
      expirationTime: new Date(now + 2000).toISOString(),
    })
    render(<Harness />)
    await act(async () => {
      await savedCb?.({})
    })
    expect(signOut).not.toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })
    expect(signOut).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/')
  })

  it('signs out and redirects immediately on token info error', async () => {
    getIdTokenResult.mockRejectedValue(new Error('x'))
    render(<Harness />)
    await act(async () => {
      await savedCb?.({})
    })
    expect(signOut).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/')
  })

  it('clears timer and unsubscribes on unmount', async () => {
    const now = new Date('2025-01-01T00:00:00.000Z').getTime()
    vi.setSystemTime(new Date(now))
    getIdTokenResult.mockResolvedValue({
      expirationTime: new Date(now + 60_000).toISOString(),
    })
    const { unmount } = render(<Harness />)
    await act(async () => {
      await savedCb?.({})
    })
    unmount()
    await act(async () => {
      vi.advanceTimersByTime(120_000)
    })
    expect(signOut).not.toHaveBeenCalled()
    expect(unsubCalled).toBe(true)
  })

  it('resets previous timer when token changes again', async () => {
    const now = new Date('2025-01-01T00:00:00.000Z').getTime()
    vi.setSystemTime(new Date(now))
    getIdTokenResult.mockResolvedValueOnce({
      expirationTime: new Date(now + 60_000).toISOString(),
    }).mockResolvedValueOnce({
      expirationTime: new Date(now + 1000).toISOString(),
    })
    render(<Harness />)
    await act(async () => {
      await savedCb?.({})
    })
    await act(async () => {
      await savedCb?.({})
    })
    await act(async () => {
      vi.advanceTimersByTime(4000)
    })
    expect(signOut).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/')
  })
})
