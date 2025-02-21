import { z } from 'zod';
import { RESUME_SIZE_LIMIT } from './resume-size-limit';

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
  secondName: z
    .string()
    .max(100, { message: 'Фамилия не может превышать 100 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  firstName: z
    .string()
    .max(100, { message: 'Имя не может превышать 100 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  lastName: z
    .string()
    .max(100, { message: 'Отчество не может превышать 100 символов' })
    .optional(),
  firstPriority: z
    .number({
      invalid_type_error: 'ID проекта должен быть числом',
      required_error: 'Необходимо заполнить',
    })
    .positive({ message: 'ID проекта должен быть положительным числом' }),
  middlePriority: z
    .number({
      invalid_type_error: 'ID проекта должен быть числом',
      required_error: 'Необходимо заполнить',
    })
    .positive({ message: 'ID проекта должен быть положительным числом' }),
  lastPriority: z
    .number({
      invalid_type_error: 'ID проекта должен быть числом',
      required_error: 'Необходимо заполнить',
    })
    .positive({ message: 'ID проекта должен быть положительным числом' }),
  otherPriority: z
    .string()
    .max(256, { message: 'Другие приоритеты не могут превышать 256 символов' })
    .optional(),
  telegram: z
    .string()
    .max(256, { message: 'Ссылка на телеграмм не может превышать 256 символов' })
    .refine(val => val.trim() !== '', { message: 'Необходимо заполнить' }),
  resumePDF: z
    .instanceof(File)
    .refine(file => ['application/pdf'].includes(file.type), {
      message: 'Необходимо прислать PDF файл',
    })
    .refine(file => file.size <= RESUME_SIZE_LIMIT, {
      message: 'Файл должен быть меньше 10 МБ',
    })
    .optional(),
  resumeLink: z
    .string()
    .max(256, { message: 'Ссылка на резюме не может превышать 256 символов' })
    .optional(),
};

export const REGISTER_FORM_SCHEMA = z.object(REGISTER_FORM_CONFIG);
