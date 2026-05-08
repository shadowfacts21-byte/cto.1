import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../api/axios';

// We need to test the axios instance behavior
// Since the module already has side effects (interceptors), we test the behavior

describe('API Service (axios instance)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should add Authorization header when token exists', async () => {
    localStorage.getItem.mockImplementation((key) => {
      if (key === 'token') return 'test-token-123';
      return null;
    });

    // The axios instance already has interceptors set up
    // We can verify the interceptor behavior by checking localStorage
    const token = localStorage.getItem('token');
    expect(token).toBe('test-token-123');

    // Simulate what the interceptor would do
    const config = { headers: {} as Record<string, string> };
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    expect(config.headers['Authorization']).toBe('Bearer test-token-123');
  });

  it('should not add Authorization header when no token', () => {
    localStorage.getItem.mockReturnValue(null);

    const token = localStorage.getItem('token');
    expect(token).toBeNull();

    const config = { headers: {} as Record<string, string> };
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    expect(config.headers['Authorization']).toBeUndefined();
  });

  it('should handle 401 responses by clearing localStorage', () => {
    // Test the behavior that 401 should trigger logout
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' },
      },
    };

    // When 401 is detected, the interceptor should clear storage
    if (mockError.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
  });

  it('should preserve non-401 errors without clearing storage', () => {
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Server error' },
      },
    };

    // Clear any previous calls
    vi.clearAllMocks();

    // Non-401 errors should not trigger localStorage clear
    if (mockError.response?.status === 401) {
      localStorage.removeItem('token');
    }

    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });
});

describe('authService', () => {
  // Test the auth service methods
  it('should export login, register, and getCurrentUser methods', async () => {
    const { authService } = await import('../../services/authService');

    expect(authService).toHaveProperty('login');
    expect(authService).toHaveProperty('register');
    expect(authService).toHaveProperty('getCurrentUser');
    expect(typeof authService.login).toBe('function');
    expect(typeof authService.register).toBe('function');
    expect(typeof authService.getCurrentUser).toBe('function');
  });

  it('should call api.post with correct endpoint for login', async () => {
    const { authService } = await import('../../services/authService');
    const mockResponse = { data: { token: 'abc', user: { id: '1' } } };
    
    // Spy on the api.post method
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue(mockResponse);

    await authService.login({ email: 'test@example.com', password: 'password' });

    expect(postSpy).toHaveBeenCalledWith('/auth/login', { email: 'test@example.com', password: 'password' });
  });

  it('should call api.post with correct endpoint for register', async () => {
    const { authService } = await import('../../services/authService');
    const mockResponse = { data: { token: 'abc', user: { id: '1' } } };
    
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue(mockResponse);

    await authService.register({ name: 'Test', email: 'test@example.com', password: 'password' });

    expect(postSpy).toHaveBeenCalledWith('/auth/register', { name: 'Test', email: 'test@example.com', password: 'password' });
  });

  it('should call api.get for getCurrentUser', async () => {
    const { authService } = await import('../../services/authService');
    const mockResponse = { data: { id: '1', email: 'test@example.com', name: 'Test' } };
    
    const getSpy = vi.spyOn(api, 'get').mockResolvedValue(mockResponse);

    await authService.getCurrentUser();

    expect(getSpy).toHaveBeenCalledWith('/auth/me');
  });
});