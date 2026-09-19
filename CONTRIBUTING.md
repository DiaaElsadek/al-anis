# Contributing to Alanis Frontend

## Project Conventions

These conventions keep the codebase consistent. Follow them for every new file or change.

---

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components (`.jsx`) | PascalCase | `LoginForm.jsx`, `ProviderCard.jsx` |
| Hooks (`.js`) | camelCase, `use` prefix | `useAuth.js`, `useProviderDashboard.js` |
| Utilities (`.js`) | camelCase | `formatCurrency.js`, `validators.js` |
| Constants (`.js`) | camelCase | `constants.js` |
| API modules (`.js`) | camelCase, per-controller | `account.js`, `provider.js` |

### Component Rules

- **One component per file**, named export matching filename.
- Components should stay **under ~150 lines**. If bigger, split into subcomponents in a colocated folder.
- **Props destructured** in the function signature, not accessed via `props.x`.

### Data Flow

- **No inline API calls** in components — always go through `src/api/` + a react-query hook.
- **No business logic** inside JSX-returning components — extract into hooks (`features/<feat>/hooks/`) or pure functions (`lib/` or `features/<feat>/utils.js`).
- Queries and mutations live in **feature-local hooks** (`features/<feat>/hooks/use<Feature>.js`).

### Import Order

Enforced by ESLint (`import-x/order`):

```
1. Built-in modules (node:path, etc.)
2. External packages (react, react-router-dom, @tanstack/react-query, etc.)
3. Internal absolute imports (@/api/..., @/lib/..., @/components/...)
4. Parent/relative imports (../, ./)
```

Separate each group with a blank line.

### Feature vs Shared

- If a component/hook is used by **one feature** → keep in `features/<feature>/components/` or `features/<feature>/hooks/`.
- If used by **two or more features** → graduate to `components/shared/` or `hooks/`.
- Re-evaluate placement whenever a second usage appears.

### Error Handling

- Every mutation's `onError` should use the shared `handleMutationError()` utility.
- Never manually extract `error?.response?.data?.message` inline.

### UI Component Guidelines (shadcn/ui & Shared Primitives)

To maintain consistent design tokens, accessibility, and RTL compatibility:
- **Never use browser dialogs**: Never use native `confirm()` or `alert()`. Use `<ConfirmDialog />` from `@/components/shared/ConfirmDialog` (wrapping shadcn `AlertDialog`).
- **Never use raw HTML tables**: Always use shadcn `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` from `@/components/ui/table`.
- **Never use raw `<select>`**: Always use shadcn `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` from `@/components/ui/select`.
- **Never use native `<input type="date">`**: Always use `<DatePicker />` from `@/components/shared/DatePicker` (built with shadcn `Calendar` + `Popover` with RTL localization).
- **Never build custom CSS spinners**: Use `<Loader2 className="animate-spin ..." />` from `lucide-react`.
- **Use standard banners**: Use `Alert`, `AlertTitle`, `AlertDescription` from `@/components/ui/alert` for alerts and error boxes.
- **Use Switch & Toggle**: Use `Switch` for boolean form toggles and `Toggle` for button filters.
- **Pagination**: Use `<Pagination />` from `@/components/shared/Pagination` (wraps shadcn `Pagination`).

### Formatting

- **Prettier** handles all formatting — don't override with manual style.
- **ESLint** catches code quality issues.
- **Pre-commit hook** (husky + lint-staged) runs both automatically on staged files.

### Commit Checklist

Before committing, make sure:

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` shows zero errors (warnings are acceptable but should be addressed)
- [ ] No `console.log` statements (use `console.error` or `console.warn` if needed)
- [ ] New components follow the naming and structure conventions above
