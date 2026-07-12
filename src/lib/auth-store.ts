const AUTH_KEY = 'ic_admin_auth';

// Usuario mockeado — no hay backend, la validación es 100% client-side.
export const MOCK_USERNAME = 'admin';
export const MOCK_PASSWORD = 'conectadas2026';

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(AUTH_KEY) === '1';
}

export function login(username: string, password: string): boolean {
  if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
    window.localStorage.setItem(AUTH_KEY, '1');
    return true;
  }
  return false;
}

export function logout(): void {
  window.localStorage.removeItem(AUTH_KEY);
}
