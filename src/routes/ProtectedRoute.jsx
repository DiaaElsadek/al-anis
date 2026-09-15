import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

/**
 * ProtectedRoute — guards routes by authentication and role
 *
 * @param {Object} props
 * @param {string[]} props.allowedRoles — roles that can access this route
 * @param {React.ReactNode} props.children — the route's element
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.some((allowed) => {
      if (allowed === role) return true;
      const normAllowed = allowed?.toLowerCase();
      const normRole = role?.toLowerCase();
      if (
        (normAllowed === "serviceprovider" || normAllowed === "provider") &&
        (normRole === "serviceprovider" || normRole === "provider")
      ) {
        return true;
      }
      if (
        (normAllowed === "user" || normAllowed === "client") &&
        (normRole === "user" || normRole === "client")
      ) {
        return true;
      }
      if (normAllowed === "admin" && normRole === "admin") {
        return true;
      }
      return normAllowed === normRole;
    });

    if (!isAllowed) {
      return <Navigate to="/403" replace />;
    }
  }

  return children;
}
