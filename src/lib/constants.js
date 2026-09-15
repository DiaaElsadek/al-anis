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

// ============================================================
// Egyptian Governorates (shared across provider directory & working areas)
// ============================================================

export const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Sharqia",
  "Qalyubia",
  "Gharbia",
  "Menofia",
];

// ============================================================
// Fallback Categories (used when backend hasn't loaded yet)
// ============================================================

export const FALLBACK_CATEGORIES = [
  {
    id: "cat-1",
    name: "تمريض منزلي ورعاية صحية",
    nameEn: "Home Nursing & Medical Care",
    icon: "Stethoscope",
    providersCount: 340,
    startingPrice: 400,
    description: "Certified nurses for post-op recovery, injections, and vitals monitoring.",
    descriptionAr:
      "ممرضون مؤهلون لمتابعة الحالات بعد العمليات، وإعطاء الحقن، ومتابعة المؤشرات الحيوية.",
  },
  {
    id: "cat-2",
    name: "رعاية كبار السن وجليسات",
    nameEn: "Elderly Care & Companionship",
    icon: "HeartHandshake",
    providersCount: 280,
    startingPrice: 350,
    description: "Compassionate aides assisting with mobility, companionship, and medication.",
    descriptionAr: "مساعدون رحماء للمساعدة في الحركة وتناول الأدوية والمرافقة اليومية باهتمام.",
  },
  {
    id: "cat-3",
    name: "رعاية وجليسات أطفال",
    nameEn: "Childcare & Babysitting",
    icon: "Baby",
    providersCount: 310,
    startingPrice: 250,
    description: "Qualified nannies for infants, toddlers, and school-age children.",
    descriptionAr: "مربيات مؤهلات لرعاية الرضع والأطفال في سن المدرسة بأمان.",
  },
  {
    id: "cat-4",
    name: "علاج طبيعي وتأهيل",
    nameEn: "Physiotherapy & Rehabilitation",
    icon: "Stethoscope",
    providersCount: 180,
    startingPrice: 500,
    description: "Licensed physiotherapists for post-surgery and chronic pain management.",
    descriptionAr: "أخصائيو علاج طبيعي مرخصون لإعادة التأهيل وإدارة الألم المزمن.",
  },
  {
    id: "cat-5",
    name: "دروس خصوصية وتأسيس",
    nameEn: "Private Tutoring",
    icon: "GraduationCap",
    providersCount: 420,
    startingPrice: 200,
    description: "Expert tutors covering all subjects from primary through university level.",
    descriptionAr: "معلمون خبراء في جميع المواد من المرحلة الابتدائية حتى الجامعية.",
  },
];
