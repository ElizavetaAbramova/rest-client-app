import { z } from 'zod';
import { PASSWORD_RE } from '@/constants/auth';

export const authSchema = (t: (k: string) => string) =>
  z.object({
    email: z.string().email({ message: t('invalid_email') }),
    password: z.string().regex(PASSWORD_RE, t('password_rules')),
  });
