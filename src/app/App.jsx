import { Analytics } from "@vercel/analytics/react";

import ErrorBoundary from "@/components/shared/ErrorBoundary";

import AppProviders from "./providers";
import AppRouter from "./router";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
        <Analytics />
      </AppProviders>
    </ErrorBoundary>
  );
}
