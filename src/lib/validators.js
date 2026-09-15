import { z } from "zod";

// ============================================================
// Shared field validators
// ============================================================

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^01[0125][0-9]{8}$/, "Invalid Egyptian phone number");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be at most 50 characters");

// ============================================================
// Auth form schemas
// ============================================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerUserSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const registerProviderSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phoneNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio must be at most 500 characters"),
    experience: z.string().min(1, "Experience is required"),
    governorate: z.string().min(1, "Governorate is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().optional(),
    categoryIds: z.array(z.string()).min(1, "Select at least one category"),
    idDocument: z
      .any()
      .refine((file) => file instanceof File, "ID document is required"),
    certificate: z.any().optional(),
    cv: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z
    .string()
    .min(4, "OTP must be at least 4 characters")
    .max(6, "OTP must be at most 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    token: z.string().min(1, "Reset token is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ============================================================
// Request form schemas
// ============================================================

export const createRequestSchema = z.object({
  serviceProviderId: z.string().min(1, "Provider is required"),
  categoryId: z.string().min(1, "Category is required"),
  shiftType: z.number().min(0).max(2),
  date: z.string().min(1, "Date is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
});

// ============================================================
// Review form schema
// ============================================================

export const createReviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(500),
});

// ============================================================
// Admin schemas
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
// Profile schemas
// ============================================================

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNumber: phoneSchema,
});

export const updateProviderProfileSchema = z.object({
  bio: z.string().min(10).max(500),
  experience: z.string().min(1),
  profilePicture: z.any().optional(),
});
