import { REGISTER_FORM_SCHEMA, RESUME_SIZE_LIMIT } from '../lib/constant';

describe('REGISTER_FORM_SCHEMA', () => {
  const validData = {
    commandName: 'it Team',
    studentId: '123456',
    studentGroupId: 'Group-1',
    lastName: 'Ivanov',
    firstName: 'Ivan',
    patronymic: 'Ivanovich',
    firstPriority: 1,
    middlePriority: 2,
    lastPriority: 3,
    otherPriority: '4, 5, 6',
    telegram: 'https://t.me/it',
    resumePDF: new File([''], 'resume.pdf', { type: 'application/pdf' }),
    resumeLink: 'https://hh.ru/resume/8e',
  };

  it('validates correct data', () => {
    expect(() => REGISTER_FORM_SCHEMA.parse(validData)).not.toThrow();
  });

  it('throws error if commandName is empty', () => {
    const data = { ...validData, commandName: '' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow('Необходимо заполнить');
  });

  it('throws error if studentId is empty', () => {
    const data = { ...validData, studentId: '' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow('Необходимо заполнить');
  });

  it('throws error if studentGroupId is empty', () => {
    const data = { ...validData, studentGroupId: '' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow('Необходимо заполнить');
  });

  it('throws error if lastName is empty', () => {
    const data = { ...validData, lastName: '' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow('Необходимо заполнить');
  });

  it('throws error if firstName is empty', () => {
    const data = { ...validData, firstName: '' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow('Необходимо заполнить');
  });

  it('throws error if commandName exceeds 256 characters', () => {
    const data = { ...validData, commandName: 'a'.repeat(257) };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      'Имя команды не может превышать 256 символов',
    );
  });

  it('throws error if studentId exceeds 256 characters', () => {
    const data = { ...validData, studentId: 'a'.repeat(257) };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      'Номер студенческого билета не может превышать 256 символов',
    );
  });

  it('throws error if studentGroupId exceeds 100 characters', () => {
    const data = { ...validData, studentGroupId: 'a'.repeat(101) };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      'Группа не может превышать 100 символов',
    );
  });

  it('throws error if firstPriority is not a number', () => {
    const data = { ...validData, firstPriority: 'not-a-number' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      'ID проекта должен быть числом',
    );
  });

  it('throws error if firstPriority is not positive', () => {
    const data = { ...validData, firstPriority: -1 };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      'ID проекта должен быть положительным числом',
    );
  });

  it('throws error if telegram link is invalid', () => {
    const data = { ...validData, telegram: 'invalid-link' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      'Ссылка должна быть виде: https://t.me/... или @... или https://telegram.me/...',
    );
  });

  it('throws error if resumeLink is invalid', () => {
    const data = { ...validData, resumeLink: 'invalid-link' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow('Неверный формат ссылки');
  });

  it('throws error if otherPriority is invalid', () => {
    const data = { ...validData, otherPriority: '4,5,6' };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Формат вида: "4, 5, 6"',
          }),
        ]),
      }),
    );
  });

  it('throws error if resumePDF is not a PDF', () => {
    const data = {
      ...validData,
      resumePDF: new File([''], 'resume.txt', { type: 'text/plain' }),
    };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      'Необходимо прислать PDF файл',
    );
  });

  it('throws error if resumePDF exceeds size limit', () => {
    const largeFile = new File(['a'.repeat(RESUME_SIZE_LIMIT + 1)], 'resume.pdf', {
      type: 'application/pdf',
    });
    const data = { ...validData, resumePDF: largeFile };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).toThrow(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Файл должен быть меньше 5 МБ',
          }),
        ]),
      }),
    );
  });

  it('validates if patronymic is optional', () => {
    const data = { ...validData, patronymic: undefined };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('validates if otherPriority is optional', () => {
    const data = { ...validData, otherPriority: undefined };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('validates if resumePDF is optional', () => {
    const data = { ...validData, resumePDF: undefined };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).not.toThrow();
  });

  it('validates if resumeLink is optional', () => {
    const data = { ...validData, resumeLink: undefined };
    expect(() => REGISTER_FORM_SCHEMA.parse(data)).not.toThrow();
  });
});
