import { z } from 'zod';

const REGISTRATION_PROJECT_FORM_CONFIG = {
  name: z
    .string()
    .max(255, { message: 'Название компании не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  representative: z
    .string()
    .max(255, { message: 'Имя представителя не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  contacts: z
    .string()
    .max(255, { message: 'Длина контактов должны быть меньше 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  email: z
    .string()
    .email({ message: 'неккоректный e-mail' })
    .max(255, { message: 'Почта не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  student_project_checkbox: z.string().optional(),
};

export const REGISTRATION_PROJECT_FORM_SCHEMA = z.object(
  REGISTRATION_PROJECT_FORM_CONFIG,
);
