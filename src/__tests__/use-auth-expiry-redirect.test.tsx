import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import * as authMod from 'firebase/auth'
import { useAuthExpiryRedirect } from '@/hooks/useAuthExpiryRedirect'

type GetAllRequest = {
  result?: unknown[]
  onsuccess?: (e: unknown) => void
  onerror?: (e: unknown) => void
}
type ObjectStore = { getAll: () => GetAllRequest }
type Transaction = { objectStore: () => ObjectStore }
type DBResult = { transaction: () => Transaction; close: () => void }
type OpenRequest = {
  result?: DBResult
  onsuccess?: (e: unknown) => void
  onerror?: (e: unknown) => void
}
type IndexedDBLike = { open: () => OpenRequest }

function stubIndexedDBNoUser() {
  const g = globalThis as unknown as { indexedDB: IndexedDBLike }
  g.indexedDB = {
    open: () => {
      const req: OpenRequest = {}
      queueMicrotask(() => {
        const getAllReq: GetAllRequest = {}
        const store: ObjectStore = {
          getAll: () => {
            queueMicrotask(() => {
              getAllReq.result = []
              getAllReq.onsuccess?.({} as unknown)
            })
            return getAllReq
          },
        }
        const tx: Transaction = { objectStore: () => store }
        const db: DBResult = { transaction: () => tx, close: () => {} }
        req.result = db
        req.onsuccess?.({} as unknown)
      })
      return req
    },
  }
}

function Probe() {
  useAuthExpiryRedirect()
  return null
}

beforeEach(() => {
  vi.restoreAllMocks()
  stubIndexedDBNoUser()
})

describe('useAuthExpiryRedirect (smoke)', () => {
  it('mounts without errors and does not sign out when no cached user', async () => {
    const spySignOut = vi.spyOn(authMod, 'signOut')
    const { container, unmount } = render(<Probe />)
    expect(container).toBeTruthy()
    await Promise.resolve()
    expect(spySignOut).not.toHaveBeenCalled()
    unmount()
  })
})
