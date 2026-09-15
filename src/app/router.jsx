import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { UserRole } from "@/lib/constants";

// Layouts
import AuthLayout from "@/components/layout/AuthLayout";
import ClientLayout from "@/components/layout/ClientLayout";
import ProviderLayout from "@/components/layout/ProviderLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Public pages
import LandingPage from "@/features/landing/LandingPage";

// Error pages
import NotFoundPage from "@/features/errors/NotFoundPage";
import ForbiddenPage from "@/features/errors/ForbiddenPage";

// Placeholder (will be replaced in later phases)
import PlaceholderPage from "@/features/placeholder/PlaceholderPage";

// ============================================================
// Auth Pages (placeholder for Phase 2)
// ============================================================
const LoginPage = () => <PlaceholderPage title="Login" description="Sign in to your account" />;
const RegisterPage = () => <PlaceholderPage title="Register" description="Create a new account" />;
const VerifyOtpPage = () => <PlaceholderPage title="Verify OTP" description="Enter the verification code sent to your email" />;
const ForgotPasswordPage = () => <PlaceholderPage title="Forgot Password" description="Reset your password" />;
const ResetPasswordPage = () => <PlaceholderPage title="Reset Password" description="Set your new password" />;

// ============================================================
// Client Pages (placeholder for Phases 3-4)
// ============================================================
const ProviderDirectoryPage = () => <PlaceholderPage title="Find Providers" description="Browse and filter verified service providers" />;
const ProviderProfilePage = () => <PlaceholderPage title="Provider Profile" description="View provider details, availability, and reviews" />;
const ClientRequestsPage = () => <PlaceholderPage title="My Requests" description="View and manage your service requests" />;
const ClientRequestDetailPage = () => <PlaceholderPage title="Request Detail" description="View request status, chat, and actions" />;
const ChatInboxPage = () => <PlaceholderPage title="Messages" description="Your chat conversations" />;
const ClientSettingsPage = () => <PlaceholderPage title="Settings" description="Manage your profile and preferences" />;

// ============================================================
// Provider Pages (placeholder for Phases 3-4)
// ============================================================
const ProviderApplyPage = () => <PlaceholderPage title="Apply as Provider" description="Complete the provider onboarding wizard" />;
const ProviderPendingPage = () => <PlaceholderPage title="Application Pending" description="Your application is under review" />;
const ProviderDashboardPage = () => <PlaceholderPage title="Provider Dashboard" description="View your stats and recent activity" />;
const ProviderEditProfilePage = () => <PlaceholderPage title="Edit Profile" description="Update your provider profile" />;
const ProviderAvailabilityPage = () => <PlaceholderPage title="Availability" description="Set your availability calendar" />;
const ProviderWorkingAreasPage = () => <PlaceholderPage title="Working Areas" description="Manage your service areas" />;
const ProviderRequestsPage = () => <PlaceholderPage title="Incoming Requests" description="Manage service requests from clients" />;
const ProviderRequestDetailPage = () => <PlaceholderPage title="Request Detail" description="View and manage this request" />;

// ============================================================
// Admin Pages (placeholder for Phases 3-4)
// ============================================================
const AdminDashboardPage = () => <PlaceholderPage title="Admin Dashboard" description="Platform overview and statistics" />;
const AdminApplicationsPage = () => <PlaceholderPage title="Provider Applications" description="Review and process provider applications" />;
const AdminUsersPage = () => <PlaceholderPage title="User Management" description="Manage platform users" />;
const AdminCategoriesPage = () => <PlaceholderPage title="Categories" description="Manage service categories" />;
const AdminPricingPage = () => <PlaceholderPage title="Service Pricing" description="Manage shift pricing per category" />;
const AdminPaymentsPage = () => <PlaceholderPage title="Payments" description="View transactions and revenue" />;

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
          <Route path="requests/:id" element={<ClientRequestDetailPage />} />
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
          <Route path="apply" element={<ProviderApplyPage />} />
          <Route path="pending" element={<ProviderPendingPage />} />
          <Route path="dashboard" element={<ProviderDashboardPage />} />
          <Route path="profile" element={<ProviderEditProfilePage />} />
          <Route path="availability" element={<ProviderAvailabilityPage />} />
          <Route path="working-areas" element={<ProviderWorkingAreasPage />} />
          <Route path="requests" element={<ProviderRequestsPage />} />
          <Route path="requests/:id" element={<ProviderRequestDetailPage />} />
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
