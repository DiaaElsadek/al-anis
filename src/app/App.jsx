import AppProviders from "./providers";
import AppRouter from "./router";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ErrorBoundary>
  );
}
