import { apiUrl } from '@/lib/api';

const TOKEN_KEY = 'ic_admin_token';

/** Devuelve el token guardado (o null si no hay sesión). */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

/** ¿Hay una sesión iniciada? (presencia de token — la validez real la revisa el servidor). */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/** Inicia sesión contra la API PHP. Devuelve true si las credenciales son correctas. */
export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl('login.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.ok && data.token) {
      window.localStorage.setItem(TOKEN_KEY, data.token);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Cambia la contraseña del usuario con sesión iniciada. Lanza Error si falla. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const token = getToken();
  const res = await fetch(apiUrl('change-password.php'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'No se pudo cambiar la contraseña.');
  }
}

/** Cierra la sesión (borra el token local). */
export function logout(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
}
