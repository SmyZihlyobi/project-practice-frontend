import { COMPANY_LOGIN_FORM_SCHEMA } from '../lib/constant';

describe('COMPANY_LOGIN_FORM_SCHEMA', () => {
  test('should validate correct login and password', () => {
    const validData = {
      login: 'testLogin',
      password: 'testPassword',
    };

    const result = COMPANY_LOGIN_FORM_SCHEMA.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('should fail validation for empty login', () => {
    const invalidData = {
      login: '',
      password: 'testPassword',
    };

    const result = COMPANY_LOGIN_FORM_SCHEMA.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors).toEqual([
      {
        message: 'Необходимо заполнить',
        path: ['login'],
      },
    ]);
  });

  test('should fail validation for empty password', () => {
    const invalidData = {
      login: 'testLogin',
      password: '',
    };

    const result = COMPANY_LOGIN_FORM_SCHEMA.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors).toEqual([
      {
        message: 'Необходимо заполнить',
        path: ['password'],
      },
    ]);
  });

  test('should fail validation for login exceeding 255 characters', () => {
    const longLogin = 'a'.repeat(256);
    const invalidData = {
      login: longLogin,
      password: 'testPassword',
    };

    const result = COMPANY_LOGIN_FORM_SCHEMA.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors).toEqual([
      {
        message: 'Логин не может превышать 256 символов',
        path: ['login'],
      },
    ]);
  });

  test('should fail validation for password exceeding 255 characters', () => {
    const longPassword = 'a'.repeat(256);
    const invalidData = {
      login: 'testLogin',
      password: longPassword,
    };

    const result = COMPANY_LOGIN_FORM_SCHEMA.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error.errors).toEqual([
      {
        message: 'Пароль не может превышать 256 символов',
        path: ['password'],
      },
    ]);
  });
});
