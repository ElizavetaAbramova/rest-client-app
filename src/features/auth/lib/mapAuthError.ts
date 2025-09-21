import { AUTH_ERR_MESSAGES } from '@/constants/auth';

export function mapAuthErr(code: string): string {
  return AUTH_ERR_MESSAGES[code] ?? 'Unknown authentication error';
}
