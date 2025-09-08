export const PASSWORD_RE = /^(?=.*\p{L})(?=.*\d)(?=.*[^\p{L}\d\s]).{8,}$/u

export const AUTH_ERR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/user-disabled': 'This account is disabled.',
  'auth/user-not-found': 'No account found for this email.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/invalid-email': 'Email format is invalid.',
}

export const mapAuthErr = (code: string): string =>
  AUTH_ERR_MESSAGES[code] ?? 'Authentication error'
