import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
});

const STORAGE_KEY = "alanis-theme";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
}) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (themeValue) => {
      let currentResolved = themeValue;
      if (themeValue === "system") {
        currentResolved = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }

      root.classList.remove("light", "dark");
      root.classList.add(currentResolved);
      root.style.colorScheme = currentResolved;
      setResolvedTheme(currentResolved);
    };

    applyTheme(theme);

    // If system mode, listen for OS color scheme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        const next = e.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(next);
        root.style.colorScheme = next;
        setResolvedTheme(next);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
