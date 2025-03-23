import { z } from 'zod';
import { STACK_REGEX } from './regex';
import { MAX_FILE_SIZE } from './max-file-size';

const CREATE_PROJECT_CONFIG = {
  name: z
    .string()
    .max(256, { message: 'Название проекта не может превышать 256 символов' })
    .refine(val => val.trim() !== '', {
      message: 'Необходимо заполнить название проекта',
    }),
  description: z
    .string()
    .max(1000, { message: 'Описание проекта не может превышать 1000 символов' })
    .refine(val => val.trim() !== '', {
      message: 'Необходимо заполнить описание проекта',
    }),
  stack: z
    .string()
    .max(500, { message: 'Стек технологий не может превышать 500 символов' })
    .refine(val => STACK_REGEX.test(val), {
      message: 'Стек технологий должен быть в формате: "reactjs, npm, nodejs"',
    }),
  teamsAmount: z
    .number()
    .min(1, { message: 'Количество команд должно быть не менее 1' })
    .max(100, { message: 'Количество команд не может превышать 100' }),
  studentProject: z.boolean(),
  presentation: z
    .instanceof(File)
    .refine(
      file =>
        file.type ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      {
        message: 'Презентация должна быть в формате .pptx',
      },
    )
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: 'Размер файла презентации не должен превышать 10 МБ',
    })
    .optional(),
  technicalSpecifications: z
    .instanceof(File)
    .refine(file => file.type === 'application/pdf', {
      message: 'Техническое задание должно быть в формате .pdf',
    })
    .refine(file => file.size <= MAX_FILE_SIZE, {
      message: 'Размер файла технического задания не должен превышать 10 МБ',
    })
    .optional(),
};

export const CREATE_PROJECT_SCHEMA = z.object(CREATE_PROJECT_CONFIG);
