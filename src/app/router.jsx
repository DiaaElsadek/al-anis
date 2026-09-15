import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "@/components/layout/AdminLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import ClientLayout from "@/components/layout/ClientLayout";
import ProviderLayout from "@/components/layout/ProviderLayout";
import AdminApplicationsPage from "@/features/admin/AdminApplicationsPage";
import AdminCategoriesPage from "@/features/admin/AdminCategoriesPage";
import AdminDashboardPage from "@/features/admin/AdminDashboardPage";
import AdminPaymentsPage from "@/features/admin/AdminPaymentsPage";
import AdminPricingPage from "@/features/admin/AdminPricingPage";
import AdminUsersPage from "@/features/admin/AdminUsersPage";
import ForgotPasswordPage from "@/features/auth/ForgotPasswordPage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ResetPasswordPage from "@/features/auth/ResetPasswordPage";
import VerifyOtpPage from "@/features/auth/VerifyOtpPage";
import ChatInboxPage from "@/features/chat/ChatInboxPage";
import ClientRequestsPage from "@/features/client/ClientRequestsPage";
import ClientSettingsPage from "@/features/client/ClientSettingsPage";
import ProviderDirectoryPage from "@/features/client/ProviderDirectoryPage";
import ProviderProfilePage from "@/features/client/ProviderProfilePage";
import ForbiddenPage from "@/features/errors/ForbiddenPage";
import NotFoundPage from "@/features/errors/NotFoundPage";
import LandingPage from "@/features/landing/LandingPage";
import ProviderAvailabilityPage from "@/features/provider/ProviderAvailabilityPage";
import ProviderDashboardPage from "@/features/provider/ProviderDashboardPage";
import ProviderEditProfilePage from "@/features/provider/ProviderEditProfilePage";
import ProviderPendingPage from "@/features/provider/ProviderPendingPage";
import ProviderRequestsPage from "@/features/provider/ProviderRequestsPage";
import ProviderWorkingAreasPage from "@/features/provider/ProviderWorkingAreasPage";
import { UserRole } from "@/lib/constants";
import ProtectedRoute from "@/routes/ProtectedRoute";

// ============================================================
// AppRouter Component
// ============================================================
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Client routes */}
        <Route
          path="app"
          element={
            <ProtectedRoute allowedRoles={[UserRole.USER]}>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="providers" replace />} />
          <Route path="providers" element={<ProviderDirectoryPage />} />
          <Route path="providers/:id" element={<ProviderProfilePage />} />
          <Route path="requests" element={<ClientRequestsPage />} />
          <Route path="requests/:id" element={<ClientRequestsPage />} />
          <Route path="chats" element={<ChatInboxPage />} />
          <Route path="settings" element={<ClientSettingsPage />} />
        </Route>

        {/* Provider routes */}
        <Route
          path="provider"
          element={
            <ProtectedRoute allowedRoles={[UserRole.SERVICE_PROVIDER]}>
              <ProviderLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="apply" element={<Navigate to="/register" replace />} />
          <Route path="pending" element={<ProviderPendingPage />} />
          <Route path="dashboard" element={<ProviderDashboardPage />} />
          <Route path="profile" element={<ProviderEditProfilePage />} />
          <Route path="availability" element={<ProviderAvailabilityPage />} />
          <Route path="working-areas" element={<ProviderWorkingAreasPage />} />
          <Route path="requests" element={<ProviderRequestsPage />} />
          <Route path="requests/:id" element={<ProviderRequestsPage />} />
          <Route path="chats" element={<ChatInboxPage />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="pricing" element={<AdminPricingPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
        </Route>

        {/* Error pages */}
        <Route path="403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
