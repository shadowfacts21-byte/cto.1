import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

// Mock authService
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

// Mock AuthContext completely - provide a simple AuthProvider and mock useAuth
vi.mock('../../context/AuthContext', () => {
  const React = require('react');
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: () => ({
      login: vi.fn(),
    }),
  };
});

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Import after mocks
import Register from '../../pages/Register';

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderRegister = () => {
    return render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render registration form with all fields', () => {
    renderRegister();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getAllByLabelText(/password/i)[0], 'password123');
    await user.type(screen.getAllByLabelText(/password/i)[1], 'differentpassword');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('should call register on success', async () => {
    const { authService } = await import('../../services/authService');
    authService.register.mockResolvedValue({
      token: 'test-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    });

    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getAllByLabelText(/password/i)[0], 'password123');
    await user.type(screen.getAllByLabelText(/password/i)[1], 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show error message on registration failure', async () => {
    const { authService } = await import('../../services/authService');
    authService.register.mockRejectedValue({
      response: { data: { message: 'Email already exists' } },
    });

    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getAllByLabelText(/password/i)[0], 'password123');
    await user.type(screen.getAllByLabelText(/password/i)[1], 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument();
  });

  it('should disable submit button while loading', async () => {
    const { authService } = await import('../../services/authService');
    authService.register.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByLabelText(/full name/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getAllByLabelText(/password/i)[0], 'password123');
    await user.type(screen.getAllByLabelText(/password/i)[1], 'password123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
    });
  });

  it('should have a link to login page', () => {
    renderRegister();

    const loginLink = screen.getByText(/sign in/i);
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});