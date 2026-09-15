import { createContext, useState, useCallback, useMemo, useEffect } from "react";

import * as accountApi from "@/api/account";
import { UserRole } from "@/lib/constants";
import { parseJwt } from "@/lib/utils";

export const AuthContext = createContext(null);

/**
 * Load persisted auth state from localStorage and enrich with JWT claims
 */
function loadPersistedAuth() {
  try {
    let user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const claims = parseJwt(accessToken);
      if (user) {
        // Enrich user with JWT claims if missing
        if (!user.fullName && claims?.FullName) {
          user.fullName = claims.FullName;
          user.name = claims.FullName;
        }
        if (!user.firstName && user.fullName) {
          const parts = user.fullName.split(" ");
          user.firstName = parts[0];
          user.lastName = parts.slice(1).join(" ");
        }
        if (!user.email && claims?.email) {
          user.email = claims.email;
        }
        if (!user.id && (claims?.UserId || claims?.nameid)) {
          user.id = claims.UserId || claims.nameid;
        }
        if (!user.phoneNumber && claims?.phoneNumber) {
          user.phoneNumber = claims.phoneNumber;
        }
      } else if (claims) {
        const parts = (claims.FullName || "").split(" ");
        const rawRole = claims.role || UserRole.USER;
        let normalizedRole = UserRole.USER;
        if (rawRole?.toLowerCase() === "user" || rawRole?.toLowerCase() === "client") {
          normalizedRole = UserRole.USER;
        } else if (
          rawRole?.toLowerCase() === "serviceprovider" ||
          rawRole?.toLowerCase() === "provider"
        ) {
          normalizedRole = UserRole.SERVICE_PROVIDER;
        } else if (rawRole?.toLowerCase() === "admin") {
          normalizedRole = UserRole.ADMIN;
        }

        user = {
          id: claims.UserId || claims.nameid,
          email: claims.email,
          fullName: claims.FullName || claims.email?.split("@")[0] || "User",
          name: claims.FullName || claims.email?.split("@")[0] || "User",
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
          phoneNumber: claims.phoneNumber || "",
          role: normalizedRole,
        };
      }
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
   * Helper to extract user profile and store tokens from login/registration response
   */
  const handleAuthSuccess = useCallback((data) => {
    if (!data) return null;

    const { accessToken: newAccess, refreshToken: newRefresh, ...userData } = data;
    const jwtClaims = newAccess ? parseJwt(newAccess) : {};

    // Extract full name from various possible fields in response or JWT
    const fullName =
      userData.fullName ||
      userData.name ||
      jwtClaims?.FullName ||
      jwtClaims?.fullName ||
      jwtClaims?.name ||
      (userData.firstName && userData.lastName
        ? `${userData.firstName} ${userData.lastName}`.trim()
        : userData.firstName || userData.lastName || "");

    const nameParts = fullName ? fullName.trim().split(" ") : [];
    const firstName = userData.firstName || (nameParts.length > 0 ? nameParts[0] : "");
    const lastName =
      userData.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

    // Normalize role string
    const rawRole = userData.role || jwtClaims?.role || UserRole.USER;
    let normalizedRole = rawRole;
    if (rawRole?.toLowerCase() === "user" || rawRole?.toLowerCase() === "client") {
      normalizedRole = UserRole.USER;
    } else if (
      rawRole?.toLowerCase() === "serviceprovider" ||
      rawRole?.toLowerCase() === "provider"
    ) {
      normalizedRole = UserRole.SERVICE_PROVIDER;
    } else if (rawRole?.toLowerCase() === "admin") {
      normalizedRole = UserRole.ADMIN;
    }

    const normalizedUser = {
      id: userData.id || userData.userId || jwtClaims?.UserId || jwtClaims?.nameid,
      email: userData.email || jwtClaims?.email,
      fullName: fullName || userData.email?.split("@")[0] || "",
      name: fullName || userData.email?.split("@")[0] || "",
      firstName,
      lastName,
      phoneNumber: userData.phoneNumber || jwtClaims?.phoneNumber || "",
      role: normalizedRole,
      isEmailConfirmed: userData.isEmailConfirmed ?? true,
      providerStatus: userData.providerStatus,
      isAvailable: userData.isAvailable ?? true,
      profilePicture: userData.profilePicture || userData.profilePictureUrl || null,
      profilePictureUrl: userData.profilePictureUrl || userData.profilePicture || null,
      serviceProviderId: userData.serviceProviderId || jwtClaims?.ServiceProviderId,
      ...userData,
    };

    if (newAccess) {
      setAuthState({
        user: normalizedUser,
        accessToken: newAccess,
        refreshToken: newRefresh || null,
      });
      localStorage.setItem("accessToken", newAccess);
      if (newRefresh) {
        localStorage.setItem("refreshToken", newRefresh);
      }
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    }

    return { user: normalizedUser, accessToken: newAccess, refreshToken: newRefresh };
  }, []);

  /**
   * Login with email & password
   */
  const login = useCallback(
    async (credentials) => {
      const data = await accountApi.login(credentials);
      return handleAuthSuccess(data);
    },
    [handleAuthSuccess]
  );

  /**
   * Login with Google idToken
   */
  const loginWithGoogle = useCallback(
    async (idToken) => {
      const data = await accountApi.loginWithGoogle({ idToken });
      return handleAuthSuccess(data);
    },
    [handleAuthSuccess]
  );

  /**
   * Register a standard client user (multipart/form-data)
   */
  const registerUser = useCallback(
    async (formData) => {
      const data = await accountApi.registerUser(formData);
      // If tokens are returned, establish auth session
      if (data?.accessToken) {
        return handleAuthSuccess(data);
      }
      return data;
    },
    [handleAuthSuccess]
  );

  /**
   * Register a service provider application (multipart/form-data)
   */
  const registerServiceProvider = useCallback(async (formData) => {
    const data = await accountApi.registerServiceProvider(formData);
    return data;
  }, []);

  /**
   * Logout — notify backend then clear local state
   */
  const logout = useCallback(async () => {
    try {
      if (accessToken) {
        await accountApi.logout();
      }
    } catch {
      // Ignore network / token expiry errors during logout
    } finally {
      setAuthState({ user: null, accessToken: null, refreshToken: null });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }, [accessToken]);

  /**
   * Update user in context (e.g., after profile edit)
   */
  const updateUser = useCallback((updatedFields) => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  /**
   * Get default redirect URL based on role and status
   */
  const getHomeRoute = useCallback(
    (userObj = user) => {
      if (!userObj) return "/login";
      const userRole = userObj.role;

      if (userRole === UserRole.ADMIN || userRole?.toLowerCase() === "admin") {
        return "/admin/dashboard";
      }
      if (
        userRole === UserRole.SERVICE_PROVIDER ||
        userRole?.toLowerCase() === "serviceprovider" ||
        userRole?.toLowerCase() === "provider"
      ) {
        // providerStatus: 1 = approved/active, 0 = pending, 2 = rejected
        return userObj.providerStatus === 1 ? "/provider/dashboard" : "/provider/pending";
      }
      return "/app/dashboard";
    },
    [user]
  );

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
      loginWithGoogle,
      registerUser,
      registerServiceProvider,
      logout,
      setAuth,
      updateUser,
      getHomeRoute,
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
      loginWithGoogle,
      registerUser,
      registerServiceProvider,
      logout,
      setAuth,
      updateUser,
      getHomeRoute,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
