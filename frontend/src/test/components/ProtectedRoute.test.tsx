import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import React from 'react';

// Mock authService
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should redirect to login when not authenticated', () => {
    localStorage.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // The redirect happens via Navigate component - check that protected content is not visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    // And login page is rendered
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('should render protected content when authenticated', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'valid-token';
      if (key === 'user') return JSON.stringify({ id: '1', email: 'test@example.com', name: 'Test' });
      return null;
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div data-testid="protected-content">Protected Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeVisible();
  });
});

// Import ProtectedRoute after mocks are set up
import ProtectedRoute from '../../components/ProtectedRoute';