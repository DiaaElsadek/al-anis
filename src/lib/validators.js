import { z } from "zod";

// ============================================================
// Shared field validators
// ============================================================

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^01[0125][0-9]{8}$/, "Enter a valid Egyptian phone number (e.g. 01012345678)");

export const firstNameSchema = z
  .string()
  .min(2, "First name is required")
  .max(50, "First name cannot exceed 50 characters")
  .regex(/^[\p{L}\s]+$/u, "First name can only contain letters and spaces");

export const lastNameSchema = z
  .string()
  .min(2, "Last name is required")
  .max(50, "Last name cannot exceed 50 characters")
  .regex(/^[\p{L}]+$/u, "Last name can only contain letters");

export const nameSchema = firstNameSchema;

export const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required")
  .refine((val) => {
    const dob = new Date(val);
    if (isNaN(dob.getTime())) return false;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 18 && age <= 65;
  }, "Age must be between 18 and 65 years");

const validDocExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
const validDocMimeTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const documentFileSchema = (label) =>
  z.any().refine((file) => {
    if (!(file instanceof File)) return false;
    const fileName = file.name?.toLowerCase() || "";
    const hasValidExt = validDocExtensions.some((ext) => fileName.endsWith(ext));
    const hasValidMime = validDocMimeTypes.includes(file.type);
    return hasValidExt || hasValidMime;
  }, `${label} must be PDF, JPG, or PNG.`);

// ============================================================
// Auth Form Schemas (matching Swagger specification)
// ============================================================

/**
 * Login Schema: POST /api/Account/login
 * Body: { email, password, phoneNumber }
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  phoneNumber: z.string().optional().default(""),
});

/**
 * Register User Schema: POST /api/Account/register-user (multipart/form-data)
 */
export const registerUserSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    dateOfBirth: dateOfBirthSchema,
    profilePicture: z
      .any()
      .optional()
      .refine((file) => !file || file instanceof File, "Profile picture must be a valid file"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Register Service Provider Schema: POST /api/Account/register-service-provider (multipart/form-data)
 */
export const registerProviderSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    dateOfBirth: dateOfBirthSchema,
    bio: z
      .string()
      .min(50, "Bio must be at least 50 characters")
      .max(600, "Bio cannot exceed 600 characters"),
    nationalId: z
      .string()
      .min(14, "National ID must be exactly 14 digits")
      .max(14, "National ID must be exactly 14 digits")
      .regex(/^[0-9]{14}$/, "National ID must contain only digits"),
    experience: z
      .string()
      .min(20, "Experience must be at least 20 characters")
      .max(500, "Experience cannot exceed 500 characters"),
    hourlyRate: z.coerce
      .number({ invalid_type_error: "Rate must be a number" })
      .positive("Hourly rate must be greater than 0"),
    selectedCategoryIds: z
      .array(z.string().uuid("Invalid category ID"))
      .min(1, "At least one category must be selected"),
    idDocument: documentFileSchema("ID document"),
    certificate: documentFileSchema("Certificate"),
    cv: documentFileSchema("CV"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Verify OTP Schema: POST /api/Account/verify-otp
 * Body: { userId, otp }
 */
export const verifyOtpSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP cannot exceed 6 digits")
    .regex(/^[0-9]+$/, "OTP must contain numbers only"),
});

/**
 * Forgot Password Schema: POST /api/Account/forget-password
 * Body: { email, phoneNumber }
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
  phoneNumber: phoneSchema,
});

/**
 * Reset Password Schema: POST /api/Account/reset-password
 * Body: { userId, otp, newPassword, confirmPassword }
 */
export const resetPasswordSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    otp: z
      .string()
      .min(4, "OTP must be at least 4 digits")
      .max(6, "OTP cannot exceed 6 digits")
      .regex(/^[0-9]+$/, "OTP must contain numbers only"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Change Password Schema: POST /api/Account/change-password
 * Body: { currentPassword, newPassword, confirmNewPassword }
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

/**
 * Create Admin Schema: POST /api/Account/create-admin
 */
export const createAdminSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ============================================================
// Service Requests & Reviews Schemas
// ============================================================

export const createRequestSchema = z.object({
  serviceProviderId: z.string().min(1, "Provider is required"),
  categoryId: z.string().min(1, "Category is required"),
  shiftType: z.number().min(0).max(2),
  date: z.string().min(1, "Date is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

export const createReviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(500),
});

// ============================================================
// Admin Management Schemas
// ============================================================

export const categorySchema = z.object({
  name: z.string().min(2, "Arabic name is required"),
  nameEn: z.string().min(2, "English name is required"),
  description: z.string().optional(),
});

export const servicePricingSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  shiftType: z.number().min(0).max(2),
  price: z.number().min(0, "Price must be positive"),
});

export const rejectReasonSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
});

// ============================================================
// Profile Edit Schemas
// ============================================================

export const updateProfileSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phoneNumber: phoneSchema,
  address: z.string().optional(),
});

export const updateProviderProfileSchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500),
  experience: z.string().min(20, "Experience must be at least 20 characters"),
  hourlyRate: z.coerce.number().positive().optional(),
  profilePicture: z.any().optional(),
});
