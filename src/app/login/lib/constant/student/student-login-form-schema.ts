import { z } from 'zod';

const STUDENT_LOGIN_FORM_CONFIG = {
  login: z
    .string()
    .max(255, { message: 'Логин не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  password: z
    .string()
    .max(255, { message: 'Пароль не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
};

export const STUDENT_LOGIN_FORM_SCHEMA = z.object(STUDENT_LOGIN_FORM_CONFIG);
