# Alanis Architecture Documentation

This document outlines the architectural principles, directory layout, data flow, and design patterns established across the **Alanis** marketplace frontend.

---

## 1. System Overview

Alanis is a dual-language (Arabic/English, RTL/LTR) on-demand marketplace SaaS connecting clients with verified home care and service providers (elderly care, nursing, childcare, physiotherapy, tutoring, housekeeping).

The frontend is structured as a Single Page Application (SPA) powered by:
- **Build & Dev Tooling**: Vite + React 18
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM (v6/v7) with role-based route guards
- **Server State & Caching**: TanStack React Query
- **Internationalization**: i18next + react-i18next (supports Arabic `ar-EG` as primary and English `en-US`, with automated document direction switching `rtl`/`ltr`)
- **Validation**: React Hook Form + Zod

---

## 2. Directory Structure

```text
src/
├── api/                    # API client layer (modular per domain)
│   ├── account.js          # Authentication, tokens, password reset
│   ├── admin.js            # Admin analytics, user moderation, stats
│   ├── axiosClient.js      # Axios instance with interceptors & auth injection
│   ├── category.js         # Service categories
│   ├── chat.js             # Direct messaging & read receipts
│   ├── payments.js         # Checkout & payment processing
│   ├── provider.js         # Service provider profile, search, availability
│   ├── requests.js         # Booking requests lifecycle (accept/reject/start/complete)
│   ├── reviews.js          # Ratings and review submissions
│   ├── servicePricing.js   # Admin category pricing tiers
│   └── user.js             # Client user profiles & picture uploads
│
├── app/                    # Application foundation
│   ├── App.jsx             # Top-level shell
│   ├── providers.jsx       # QueryClient, AuthProvider, ThemeProvider, Toaster
│   └── router.jsx          # Route declarations & route guards
│
├── components/
│   ├── layout/             # Application structural layouts
│   │   ├── AdminLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── ClientLayout.jsx
│   │   ├── Navbar.jsx
│   │   └── ProviderLayout.jsx
│   ├── shared/             # Cross-cutting reusable domain components
│   │   ├── CategoryIcon.jsx        # Universal Lucide icon resolver for categories
│   │   ├── ConfirmDialog.jsx       # Modal confirmation dialog (wraps AlertDialog)
│   │   ├── DashboardSkeleton.jsx   # Standardized dashboard loading skeleton
│   │   ├── DatePicker.jsx          # Accessible popover date picker (wraps Calendar)
│   │   ├── DirectionalIcon.jsx     # RTL-aware chevron/arrow icon
│   │   ├── EmptyState.jsx          # Standardized empty/error state with CTA/retry
│   │   ├── ErrorBoundary.jsx       # React error boundary fallback
│   │   ├── FileUploadField.jsx     # Document/image drag-and-drop uploader
│   │   ├── LanguageSwitcher.jsx    # Arabic/English locale toggler
│   │   ├── PageHeader.jsx          # Uniform page title & actions banner
│   │   ├── Pagination.jsx          # Page navigation component
│   │   ├── RatingStars.jsx         # 5-star rating display & input
│   │   ├── StatusBadge.jsx         # Status badge mapping IDs/strings to theme colors
│   │   └── ThemeToggle.jsx         # Light/Dark mode switcher
│   └── ui/                 # Atomic UI primitives (shadcn/ui + Radix)
│
├── context/                # Global React Contexts
│   ├── AuthContext.jsx     # User session, JWT tokens, login/logout, role checks
│   └── ThemeContext.jsx    # Dark/Light theme mode persistence
│
├── features/               # Feature domains (colocated subcomponents)
│   ├── admin/              # Admin Portal
│   │   ├── components/     # Decomposed admin modals, tables, and charts
│   │   └── Admin*Page.jsx
│   ├── auth/               # Auth & Onboarding
│   │   ├── components/     # Registration forms, submitted card, dialogs
│   │   └── *Page.jsx
│   ├── chat/               # Real-time Messaging
│   │   ├── components/     # ChatSidebar, MessagePanel
│   │   └── ChatInboxPage.jsx
│   ├── client/             # Client Portal
│   │   ├── components/     # DirectoryFilters, ProviderCard, BookingDialog, etc.
│   │   └── *Page.jsx
│   ├── errors/             # Error Screens
│   │   ├── ForbiddenPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── landing/            # Public Landing Page
│   │   ├── components/     # 11 modular landing sections
│   │   ├── data.js         # Landing features, FAQs, shift configurations
│   │   └── LandingPage.jsx
│   └── provider/           # Service Provider Portal
│       ├── components/     # Availability modals, stats grids, job lists
│       └── Provider*Page.jsx
│
├── hooks/                  # Cross-cutting custom hooks
│   ├── useAuth.js          # Session access
│   ├── useChatNavigation.js# Start/resume chat navigation helper
│   ├── useDebounce.js      # Search input debouncing
│   └── usePagination.js    # Client/server pagination calculations
│
├── i18n/                   # Translation resources & i18next configuration
│   ├── locales/ar/         # Arabic translations
│   ├── locales/en/         # English translations
│   └── index.js            # i18next initialization & direction helper
│
├── lib/                    # Shared utilities, constants, and schemas
│   ├── constants.js        # UserRoles, RequestStatuses, Governorates, Categories
│   ├── utils.js            # cn, formatPrice, getShiftLabel, handleMutationError
│   └── validators.js       # Zod schemas for auth, bookings, reviews, pricing
│
├── routes/
│   └── ProtectedRoute.jsx  # Role-based route guard
│
└── styles/
    └── globals.css         # Tailwind directives & CSS custom properties
```

---

## 3. Key Design & Code Patterns

### A. Data Fetching & Server State (React Query)
1. **API Abstraction**: Components never call Axios directly. All HTTP requests are encapsulated in `src/api/*.js`.
2. **Predictable Query Keys**: Query keys use hierarchical arrays (e.g. `["provider-requests", providerId]`, `["chat-messages", activeChatId]`).
3. **Automatic Invalidation**: Successful mutations invalidate matching queries via `queryClient.invalidateQueries(...)`.

### B. Standardized Mutation Error Handling
Every mutation handles errors with the unified helper:
```javascript
import { handleMutationError } from "@/lib/utils";

const mutation = useMutation({
  mutationFn: myApiFunction,
  onSuccess: () => {
    toast.success(t("common:success"));
  },
  onError: (error) => handleMutationError(error, t, "common:error"),
});
```
This guarantees uniform toast styling, localization, and safe extraction of backend validation details.

### C. Standardized Error, Loading & Empty States
All data-fetching views conform to a consistent 3-stage lifecycle:
1. **Loading**: Renders skeleton views (`<Skeleton />` or `<DashboardSkeleton />`) matching the layout geometry.
2. **Error**: Renders `<EmptyState icon={AlertCircle} title={t("common:error")} description={t("common:empty.tryAdjusting")} actionLabel={t("common:actions.retry")} onAction={() => refetch()} />`.
3. **Empty**: Renders `<EmptyState />` with a domain-specific icon, descriptive copy, and a context-appropriate action.

### D. Component Decomposition Rules
- **Size Limit**: Top-level page files should remain under ~150–200 lines.
- **Colocation**: Subcomponents exclusive to a feature are placed in `src/features/<feature>/components/`.
- **Reusable Graduation**: Components utilized by two or more features graduate to `src/components/shared/`.

### E. Internationalization & Formatting
- **Currency**: Handled exclusively via `formatPrice(amount, currency = "EGP", locale = i18n.language)`.
- **Dates**: Handled via `formatLocalizedDate(date, formatStr, locale = i18n.language)`.
- **Directionality**: RTL-aware icons and layouts utilize `DirectionalIcon` and logical CSS classes (`start-*`, `end-*`, `ps-*`, `pe-*`, `ms-*`, `me-*`).

### F. UI Component Library Conventions (shadcn/ui & Shared Primitives)
Every UI element across features must consume the design system tokens and primitives:
1. **Modal Confirmation**: Replaces browser `confirm()` with `<ConfirmDialog />` backed by `@radix-ui/react-alert-dialog`.
2. **Tables**: Features must consume `@/components/ui/table` primitives (`Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell`).
3. **Dropdowns & Selects**: Use `@/components/ui/select` for single-select dropdowns, synchronized with react-hook-form via `setValue(name, val, { shouldValidate: true })`.
4. **Date Pickers**: Replace native `<input type="date">` with `<DatePicker />` from `@/components/shared/DatePicker`.
5. **State Toggles**: Use `@/components/ui/switch` for boolean form options and `@/components/ui/toggle` for filter/option toggles.
6. **Alerts & Banners**: Use `@/components/ui/alert` for error and notice boxes.
7. **Loading Spinners**: Use `<Loader2 className="animate-spin ..." />` from `lucide-react` across buttons and overlays.
8. **Pagination**: Use `@/components/shared/Pagination` wrapping shadcn `Pagination` with RTL chevron flip and ellipsis.

---

## 4. Quality & Linting Standards

- **ESLint**: Strict flat configuration enforcing zero unused variables, correct React Hooks rules, and sorted import statements.
- **Prettier**: Consistent formatting across all JS, JSX, JSON, and CSS files.
- **Pre-commit Hooks**: Managed via Husky and lint-staged to ensure no unformatted or invalid code is committed.
- **Build Verification**: `npm run build` must run with 0 errors before merging changes.
