import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import type { Auth, User, UserCredential } from 'firebase/auth'

vi.mock('firebase/app', () => {
  class FirebaseError extends Error {
    code: string
    constructor(code: string, message?: string) {
      super(message)
      this.name = 'FirebaseError'
      this.code = code
    }
  }
  return {
    initializeApp: vi.fn(() => ({})),
    getApps: vi.fn(() => []),
    FirebaseError,
  }
})

vi.mock('firebase/auth', () => {
  type Unsub = () => void
  const unsub: Unsub = () => {}
  return {
    getAuth: vi.fn((): Auth => ({} as Auth)),
    onAuthStateChanged: vi.fn((a: Auth, cb: (u: User | null) => void): Unsub => {
      void a
      cb(null)
      return unsub
    }),
    onIdTokenChanged: vi.fn(
      (a: Auth, observer: ((u: User | null) => void) | { next?: (u: User | null) => void }): Unsub => {
        void a
        if (typeof observer === 'function') observer(null)
        else observer?.next?.(null)
        return unsub
      }
    ),
    signOut: vi.fn((a: Auth): Promise<void> => {
      void a
      return Promise.resolve()
    }),
    signInWithEmailAndPassword: vi.fn(
      (a: Auth, email: string, password: string): Promise<UserCredential> => {
        void a
        void email
        void password
        return Promise.resolve({} as unknown as UserCredential)
      }
    ),
    createUserWithEmailAndPassword: vi.fn(
      (a: Auth, email: string, password: string): Promise<UserCredential> => {
        void a
        void email
        void password
        return Promise.resolve({} as unknown as UserCredential)
      }
    ),
    sendPasswordResetEmail: vi.fn((a: Auth, email: string): Promise<void> => {
      void a
      void email
      return Promise.resolve()
    }),
  }
})

vi.mock('next/navigation', () => {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }
  return {
    useRouter: () => router,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
    redirect: vi.fn(),
  }
})
