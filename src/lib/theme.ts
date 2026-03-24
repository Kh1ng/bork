export type ThemePreference = "dark" | "light";

export const THEME_STORAGE_KEY = "bork-theme";

export const getStoredTheme = (): ThemePreference => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
};

export const applyTheme = (theme: ThemePreference): void => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

export const initializeTheme = (): ThemePreference => {
  const theme = getStoredTheme();
  applyTheme(theme);
  return theme;
};

export const nextTheme = (theme: ThemePreference): ThemePreference =>
  theme === "dark" ? "light" : "dark";