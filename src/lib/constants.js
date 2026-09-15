// ============================================================
// Backend Enum Mirrors
// ============================================================

/**
 * Shift types for service bookings
 */
export const ShiftType = {
  MORNING: 0,
  EVENING: 1,
  NIGHT: 2,
};

export const ShiftTypeLabels = {
  [ShiftType.MORNING]: "Morning",
  [ShiftType.EVENING]: "Evening",
  [ShiftType.NIGHT]: "Night",
};

/**
 * Service request statuses
 */
export const ServiceRequestStatus = {
  PENDING: 0,
  ACCEPTED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  REJECTED: 4,
  CANCELLED: 5,
};

export const ServiceRequestStatusLabels = {
  [ServiceRequestStatus.PENDING]: "Pending",
  [ServiceRequestStatus.ACCEPTED]: "Accepted",
  [ServiceRequestStatus.IN_PROGRESS]: "In Progress",
  [ServiceRequestStatus.COMPLETED]: "Completed",
  [ServiceRequestStatus.REJECTED]: "Rejected",
  [ServiceRequestStatus.CANCELLED]: "Cancelled",
};

/**
 * Service provider application statuses
 */
export const ServiceProviderApplicationStatus = {
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

export const ServiceProviderApplicationStatusLabels = {
  [ServiceProviderApplicationStatus.PENDING]: "Pending",
  [ServiceProviderApplicationStatus.APPROVED]: "Approved",
  [ServiceProviderApplicationStatus.REJECTED]: "Rejected",
};

/**
 * Service provider statuses (after application is approved)
 */
export const ServiceProviderStatus = {
  ACTIVE: 0,
  SUSPENDED: 1,
};

export const ServiceProviderStatusLabels = {
  [ServiceProviderStatus.ACTIVE]: "Active",
  [ServiceProviderStatus.SUSPENDED]: "Suspended",
};

/**
 * Payment statuses
 */
export const PaymentStatus = {
  PENDING: 0,
  COMPLETED: 1,
  FAILED: 2,
  REFUNDED: 3,
};

export const PaymentStatusLabels = {
  [PaymentStatus.PENDING]: "Pending",
  [PaymentStatus.COMPLETED]: "Completed",
  [PaymentStatus.FAILED]: "Failed",
  [PaymentStatus.REFUNDED]: "Refunded",
};

/**
 * Payment methods
 */
export const PaymentMethod = {
  CREDIT_CARD: 0,
  DEBIT_CARD: 1,
  WALLET: 2,
  CASH: 3,
};

export const PaymentMethodLabels = {
  [PaymentMethod.CREDIT_CARD]: "Credit Card",
  [PaymentMethod.DEBIT_CARD]: "Debit Card",
  [PaymentMethod.WALLET]: "Wallet",
  [PaymentMethod.CASH]: "Cash",
};

/**
 * User roles
 */
export const UserRole = {
  USER: "User",
  SERVICE_PROVIDER: "ServiceProvider",
  ADMIN: "Admin",
};

// ============================================================
// Status → color mappings for StatusBadge
// ============================================================

export const statusColorMap = {
  // Request statuses
  [ServiceRequestStatus.PENDING]: "amber",
  [ServiceRequestStatus.ACCEPTED]: "blue",
  [ServiceRequestStatus.IN_PROGRESS]: "purple",
  [ServiceRequestStatus.COMPLETED]: "green",
  [ServiceRequestStatus.REJECTED]: "red",
  [ServiceRequestStatus.CANCELLED]: "red",

  // Application statuses
  pending: "amber",
  approved: "blue",
  rejected: "red",

  // Provider statuses
  active: "green",
  suspended: "red",

  // Payment statuses
  completed: "green",
  failed: "red",
  refunded: "amber",
};

// ============================================================
// App Constants
// ============================================================

export const PAGINATION_DEFAULT_PAGE_SIZE = 10;
export const CHAT_POLL_INTERVAL = 5000; // 5 seconds
export const APPLICATION_POLL_INTERVAL = 30000; // 30 seconds

export const ACCEPTED_FILE_TYPES = {
  documents: ".pdf,.doc,.docx",
  images: ".jpg,.jpeg,.png,.webp",
  all: ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp",
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
