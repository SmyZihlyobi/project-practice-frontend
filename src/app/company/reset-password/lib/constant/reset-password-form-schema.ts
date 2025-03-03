import { z } from 'zod';

const RESET_PASSWORD_FORM_CONFIG = {
  email: z
    .string()
    .max(255, { message: 'Почта не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
};

export const RESET_PASSWORD_FORM_SCHEMA = z.object(RESET_PASSWORD_FORM_CONFIG);
