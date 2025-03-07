import { z } from 'zod';

const REGISTRATION_COMPANY_FORM_CONFIG = {
  name: z
    .string()
    .max(255, { message: 'Название компании не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  representative: z
    .string()
    .max(255, { message: 'Имя представителя не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),

  // добавить регулярку на ссылку
  contacts: z
    .string()
    .max(255, { message: 'Длина контактов должны быть меньше 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  email: z
    .string()
    .email({ message: 'неккоректный e-mail' })
    .max(255, { message: 'Почта не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),

  studentProject: z.boolean().optional(),
};

export const REGISTRATION_COMPANY_FORM_SCHEMA = z.object(
  REGISTRATION_COMPANY_FORM_CONFIG,
);
