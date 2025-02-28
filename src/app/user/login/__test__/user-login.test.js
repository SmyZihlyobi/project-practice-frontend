import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from './../page';
import { LOCALSTORAGE_NAME } from '../lib/constant';
import '@testing-library/jest-dom';
import { beforeEach, describe, it } from 'node:test';

describe('Page component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<Page />);
    expect(screen.getByLabelText(/Логин/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/i)).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    render(<Page />);

    const submitButton = screen.getByRole('button', { name: /Войти/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/Необходимо заполнить/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('loads saved data from localStorage on mount', async () => {
    const savedData = {
      login: 'Saved Team',
      password: '654321',
    };
    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(savedData));

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Логин/i)).toHaveValue(savedData.login);
      expect(screen.getByLabelText(/Пароль/i)).toHaveValue(savedData.password);
    });
  });
});
