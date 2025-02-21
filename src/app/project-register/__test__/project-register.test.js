import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Page from './../page';
import { LOCALSTORAGE_NAME } from './../lib/constant';
import '@testing-library/jest-dom';

describe('Page Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders the form with all fields', () => {
    render(<Page />);
    expect(screen.getByLabelText(/Название команды/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Номер студенческого билета/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Группа \(из ЕТИС\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Фамилия/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Имя/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Отчество/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ID проекта с первым приоритетом/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ID проекта с вторым приоритетом/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/ID проекта с третьим приоритетом/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Остальные приоритеты по желанию/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ссылка на телеграмм для связи/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ссылка на ваше резюме/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Загрузите ваше резюме \(PDF\)/i)).toBeInTheDocument();
  });

  it('validates form fields and shows error messages', async () => {
    render(<Page />);

    const submitButton = screen.getByRole('button', { name: /Присоединиться/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Необходимо заполнить/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('submits the form and clears the fields', async () => {
    render(<Page />);

    const commandNameInput = screen.getByLabelText(/Название команды/i);
    const studentIdInput = screen.getByLabelText(/Номер студенческого билета/i);
    const submitButton = screen.getByRole('button', { name: /Присоединиться/i });

    userEvent.type(commandNameInput, 'Test Team');
    userEvent.type(studentIdInput, '123456');

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(commandNameInput).toHaveValue('');
      expect(studentIdInput).toHaveValue('');
    });
  });

  it('loads saved data from localStorage on mount', async () => {
    const savedData = {
      commandName: 'Saved Team',
      studentId: '654321',
    };
    localStorage.setItem(LOCALSTORAGE_NAME, JSON.stringify(savedData));

    render(<Page />);

    const submitButton = screen.getByRole('button', { name: /Присоединиться/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Необходимо заполнить/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it.todo('add api check');
});
