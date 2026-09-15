import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const { i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith("ar");

  return (
    <Toaster
      theme={resolvedTheme}
      position={isRtl ? "top-left" : "top-right"}
      dir={isRtl ? "rtl" : "ltr"}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: "inherit",
        },
      }}
    />
  );
}

/**
 * AppProviders — wraps the entire app with:
 * 1. QueryClientProvider (react-query)
 * 2. ThemeProvider (dark / light / system theme context)
 * 3. AuthProvider (auth context)
 * 4. ThemedToaster (sonner with dynamic theme syncing & RTL position mirroring)
 */
export default function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <AuthProvider>
          {children}
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
