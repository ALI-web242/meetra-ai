const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

// Secure token storage utility
class TokenStorage {
  private static ACCESS_TOKEN_KEY = 'accessToken';
  private static REFRESH_TOKEN_KEY = 'refreshToken';
  private static TOKEN_EXPIRY_KEY = 'tokenExpiry';

  static setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;

    // Store tokens in localStorage (for development)
    // In production, consider using HttpOnly cookies via backend
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);

    // Store expiry time
    const expiryTime = Date.now() + tokens.expiresIn * 1000;
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;

    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    // Consider token expired 5 minutes before actual expiry
    const bufferTime = 5 * 60 * 1000;
    return Date.now() > parseInt(expiry) - bufferTime;
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }
}

// Auth service with automatic token refresh
export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    TokenStorage.setTokens(data);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    TokenStorage.setTokens(data);
    return data;
  },

  loginWithGoogle(): void {
    window.location.href = `${API_BASE_URL}/api/v1/auth/login/google`;
  },

  handleOAuthCallback(accessToken: string, refreshToken: string): void {
    TokenStorage.setTokens({
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour default
    });
  },

  logout(): void {
    TokenStorage.clearTokens();
    window.location.href = '/login';
  },

  getAccessToken(): string | null {
    return TokenStorage.getAccessToken();
  },

  isAuthenticated(): boolean {
    const token = TokenStorage.getAccessToken();
    return !!token && !TokenStorage.isTokenExpired();
  },

  async refreshToken(): Promise<boolean> {
    const refreshToken = TokenStorage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        TokenStorage.clearTokens();
        return false;
      }

      const data: AuthTokens = await response.json();
      TokenStorage.setTokens(data);
      return true;
    } catch {
      TokenStorage.clearTokens();
      return false;
    }
  },

  // Authenticated fetch wrapper
  async authenticatedFetch(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    // Check if token needs refresh
    if (TokenStorage.isTokenExpired()) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        throw new Error('Session expired');
      }
    }

    const token = TokenStorage.getAccessToken();
    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(url, { ...options, headers });
  },
};

export default authService;
