import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Kontrollo nëse useri është i loguar në fillim
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Token invalid, removing from storage:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  // Kontrollo nëse useri është i loguar
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token && !!user;
  };

  // Kontrollo nëse useri NUK është i loguar
  const isNotAuthenticated = () => {
    return !isAuthenticated();
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.signup(userData);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Kontrollo dhe rifresko token nëse është i nevojshëm
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      try {
        const userData = await authService.getProfile();
        setUser(userData);
        return true;
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        return false;
      }
    }
    return !!user;
  };

  const value = {
    user,
    loading,
    isInitialized,
    login,
    signup,
    logout,
    isAuthenticated: isAuthenticated(),
    isNotAuthenticated: isNotAuthenticated(),
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
