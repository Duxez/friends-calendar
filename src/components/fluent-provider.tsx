"use client";

import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "friends-calendar-theme";
const THEME_COOKIE_KEY = "theme";

type AppFluentProviderProps = {
  children: React.ReactNode;
  initialTheme: ThemeMode;
};

const useStyles = makeStyles({
  root: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    ...shorthands.padding(0),
  },
  toolbar: {
    position: "fixed",
    top: tokens.spacingVerticalM,
    right: tokens.spacingHorizontalM,
    zIndex: 1000,
  },
  content: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
  },
});

export function AppFluentProvider({ children, initialTheme }: AppFluentProviderProps) {
  const styles = useStyles();
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    document.cookie = `${THEME_COOKIE_KEY}=${themeMode}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.setAttribute("data-theme", themeMode);
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode]);

  const theme = themeMode === "dark" ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={theme} className={styles.root}>
      <div className={styles.toolbar}>
        <ThemeSwitcher mode={themeMode} onToggle={setThemeMode} />
      </div>
      <div className={styles.content}>{children}</div>
    </FluentProvider>
  );
}
