import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import React from 'react';

// Test component that uses the auth context
const TestConsumer: React.FC = () => {
  const { user, token, login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <span data-testid="is-auth">{isAuthenticated ? 'true' : 'false'}</span>
      <span data-testid="has-user">{user ? 'true' : 'false'}</span>
      <span data-testid="has-token">{token ? 'true' : 'false'}</span>
      <span data-testid="user-email">{user?.email || 'none'}</span>
      <span data-testid="user-name">{user?.name || 'none'}</span>
      <button onClick={() => login('test-token', { id: '1', email: 'test@example.com', name: 'Test User' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide initial unauthenticated state when no token', () => {
    localStorage.getItem.mockReturnValue(null);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-auth')).toHaveTextContent('false');
    expect(screen.getByTestId('has-user')).toHaveTextContent('false');
    expect(screen.getByTestId('has-token')).toHaveTextContent('false');
  });

  it('should login successfully and update state', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByText('Login'));

    expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
    expect(screen.getByTestId('has-user')).toHaveTextContent('true');
    expect(screen.getByTestId('has-token')).toHaveTextContent('true');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
  });

  it('should persist login to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByText('Login'));

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ id: '1', email: 'test@example.com', name: 'Test User' })
    );
  });

  it('should logout successfully and clear state', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByText('Login'));
    expect(screen.getByTestId('is-auth')).toHaveTextContent('true');

    await user.click(screen.getByText('Logout'));
    expect(screen.getByTestId('is-auth')).toHaveTextContent('false');
    expect(screen.getByTestId('has-user')).toHaveTextContent('false');
    expect(screen.getByTestId('has-token')).toHaveTextContent('false');
  });

  it('should remove items from localStorage on logout', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await user.click(screen.getByText('Login'));
    await user.click(screen.getByText('Logout'));

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should load user from localStorage when token exists', () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'stored-token';
      if (key === 'user') return JSON.stringify({ id: '2', email: 'stored@example.com', name: 'Stored User' });
      return null;
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
    expect(screen.getByTestId('has-user')).toHaveTextContent('true');
    expect(screen.getByTestId('user-email')).toHaveTextContent('stored@example.com');
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});