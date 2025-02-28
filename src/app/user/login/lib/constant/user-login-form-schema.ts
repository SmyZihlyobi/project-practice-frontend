import { z } from 'zod';

const USER_LOGIN_FORM_CONFIG = {
  login: z
    .string()
    .max(255, { message: 'Логин не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  password: z
    .string()
    .max(255, { message: 'Пароль не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
};

export const USER_LOGIN_FORM_SCHEMA = z.object(USER_LOGIN_FORM_CONFIG);
