import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface LoginResponse {
  token: string;
  admin: AdminUser;
  error?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const API = import.meta.env.VITE_API_URL ?? 'https://tirupati-metal-casting.onrender.com/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const savedToken = localStorage.getItem('tmc_token');
  const [token, setToken] = useState<string | null>(savedToken);
  const [loading, setLoading] = useState(!!savedToken); // only show loading if there's a token to verify

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
    fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(r => r.ok ? (r.json() as Promise<AdminUser>) : Promise.reject())
      .then(setAdmin)
      .catch(() => { setToken(null); localStorage.removeItem('tmc_token'); })
      .finally(() => { clearTimeout(timeout); setLoading(false); });
    return () => { controller.abort(); clearTimeout(timeout); };
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json() as LoginResponse;
    if (!res.ok) throw new Error(data.error ?? 'Login failed');
    localStorage.setItem('tmc_token', data.token);
    setToken(data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    setAdmin(null); setToken(null);
    localStorage.removeItem('tmc_token');
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export const API_BASE = API;
