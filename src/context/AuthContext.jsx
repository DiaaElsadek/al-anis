import { createContext, useState, useCallback, useMemo, useEffect } from "react";
import { UserRole } from "@/lib/constants";
import * as accountApi from "@/api/account";

export const AuthContext = createContext(null);

/**
 * Load persisted auth state from localStorage
 */
function loadPersistedAuth() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (user && accessToken) {
      return { user, accessToken, refreshToken };
    }
  } catch {
    // Corrupted localStorage — clear and start fresh
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
  return { user: null, accessToken: null, refreshToken: null };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(loadPersistedAuth);

  const { user, accessToken, refreshToken } = authState;

  // Derived state
  const isAuthenticated = !!accessToken && !!user;
  const role = user?.role || null;

  /**
   * Persist auth data to localStorage whenever it changes
   */
  useEffect(() => {
    if (user && accessToken) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
  }, [user, accessToken, refreshToken]);

  /**
   * Set auth state after a successful login/register
   */
  const setAuth = useCallback((userData, tokens) => {
    setAuthState({
      user: userData,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }, []);

  /**
   * Login with email/password
   */
  const login = useCallback(async (credentials) => {
    const data = await accountApi.login(credentials);
    // Expected data shape: { user: {..., role}, accessToken, refreshToken }
    setAuthState({
      user: data.user || data,
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
    });
    return data;
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(async (userData) => {
    const data = await accountApi.register(userData);
    return data;
  }, []);

  /**
   * Register a new service provider (multipart form)
   */
  const registerProvider = useCallback(async (formData) => {
    const data = await accountApi.registerProvider(formData);
    return data;
  }, []);

  /**
   * Logout — clear all auth state
   */
  const logout = useCallback(() => {
    setAuthState({ user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  /**
   * Update user data in context (e.g., after profile edit)
   */
  const updateUser = useCallback((updatedFields) => {
    setAuthState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updatedFields },
    }));
  }, []);

  // Role check helpers
  const isUser = role === UserRole.USER;
  const isProvider = role === UserRole.SERVICE_PROVIDER;
  const isAdmin = role === UserRole.ADMIN;

  const hasRole = useCallback(
    (requiredRole) => {
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(role);
      }
      return role === requiredRole;
    },
    [role]
  );

  const value = useMemo(
    () => ({
      user,
      role,
      accessToken,
      refreshToken,
      isAuthenticated,
      isUser,
      isProvider,
      isAdmin,
      hasRole,
      login,
      register,
      registerProvider,
      logout,
      setAuth,
      updateUser,
    }),
    [
      user,
      role,
      accessToken,
      refreshToken,
      isAuthenticated,
      isUser,
      isProvider,
      isAdmin,
      hasRole,
      login,
      register,
      registerProvider,
      logout,
      setAuth,
      updateUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
