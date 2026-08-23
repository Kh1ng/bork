import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "dark" | "light";

export const THEME_STORAGE_KEY = "bork-theme";

/** Returns the saved preference, defaulting to Bork's dark theme during SSR and first visits. */
export const getStoredTheme = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
};

/** Applies and persists one theme preference at the document boundary. */
export const applyTheme = (theme: ThemePreference): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

/** Synchronizes the initial React state with the stored document theme. */
export const initializeTheme = (): ThemePreference => {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
};

export const nextTheme = (theme: ThemePreference): ThemePreference =>
  theme === "dark" ? "light" : "dark";

/** Keeps theme state and DOM persistence behind one component-facing interface. */
export const useTheme = () => {
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

  useEffect(() => applyTheme(theme), [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => nextTheme(currentTheme));
  }, []);

  return { theme, toggleTheme };
};
