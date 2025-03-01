import { z } from 'zod';

const COMPANY_LOGIN_FORM_CONFIG = {
  email: z
    .string()
    .max(255, { message: 'Логин не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  password: z
    .string()
    .max(255, { message: 'Пароль не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
};

export const COMPANY_LOGIN_FORM_SCHEMA = z.object(COMPANY_LOGIN_FORM_CONFIG);
