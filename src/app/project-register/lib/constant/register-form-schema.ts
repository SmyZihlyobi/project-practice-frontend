import { z } from 'zod';
import { RESUME_SIZE_LIMIT } from './resume-size-limit';
import { TELEGRAM_LINK_REGEX, URL_REGEX, OTHER_PRIORITY_REGEX } from './regex';

const REGISTER_FORM_CONFIG = {
  commandName: z
    .string()
    .max(256, { message: 'Имя команды не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  studentId: z
    .string()
    .max(256, { message: 'Номер студенческого билета не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  studentGroupId: z
    .string()
    .max(100, { message: 'Группа не может превышать 100 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  lastName: z
    .string()
    .max(100, { message: 'Фамилия не может превышать 100 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  firstName: z
    .string()
    .max(100, { message: 'Имя не может превышать 100 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  patronymic: z
    .string()
    .max(100, { message: 'Отчество не может превышать 100 символов' })
    .optional(),
  course: z
    .number()
    .min(1, { message: 'Допустимы только 1 и 2 курсы' })
    .max(2, { message: 'Допустимы только 1 и 2 курсы' }),
  firstPriority: z
    .number({
      invalid_type_error: 'ID проекта должен быть числом',
      required_error: 'Необходимо заполнить',
    })
    .max(Number.MAX_SAFE_INTEGER, { message: 'Слишком большое число' })
    .positive({ message: 'ID проекта должен быть положительным числом' }),
  middlePriority: z
    .number({
      invalid_type_error: 'ID проекта должен быть числом',
      required_error: 'Необходимо заполнить',
    })
    .max(Number.MAX_SAFE_INTEGER, { message: 'Слишком большое число' })
    .positive({ message: 'ID проекта должен быть положительным числом' }),
  lastPriority: z
    .number({
      invalid_type_error: 'ID проекта должен быть числом',
      required_error: 'Необходимо заполнить',
    })
    .max(Number.MAX_SAFE_INTEGER, { message: 'Слишком большое число' })
    .positive({ message: 'ID проекта должен быть положительным числом' }),
  otherPriority: z
    .string()
    .max(256, { message: 'Другие приоритеты не могут превышать 256 символов' })
    .refine(val => !val || OTHER_PRIORITY_REGEX.test(val), {
      message: 'Формат вида: "4, 5, 6"',
    })
    .optional(),
  telegram: z
    .string()
    .max(256, { message: 'Ссылка на телеграмм не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' })
    .refine(val => TELEGRAM_LINK_REGEX.test(val), {
      message:
        'Ссылка должна быть виде: https://t.me/... или @... или https://telegram.me/...',
    }),
  resumePDF: z
    .instanceof(File)
    .refine(file => ['application/pdf'].includes(file.type), {
      message: 'Необходимо прислать PDF файл',
    })
    .refine(file => file.size <= RESUME_SIZE_LIMIT, {
      message: 'Файл должен быть меньше 5 МБ',
    })
    .optional(),
  resumeLink: z
    .string()
    .max(256, { message: 'Ссылка на резюме не может превышать 256 символов' })
    .refine(val => !val || URL_REGEX.test(val), { message: 'Неверный формат ссылки' })
    .optional(),
};

export const REGISTER_FORM_SCHEMA = z.object(REGISTER_FORM_CONFIG);
