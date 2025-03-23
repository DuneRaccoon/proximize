import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authService, userService } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, full_name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.login({ username: email, password });
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (email: string, password: string, full_name?: string) => {
    setIsLoading(true);
    try {
      await authService.register({ email, password, full_name });
      // After registration, login automatically
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
