/**
 * @file ThemeManagerProvider.tsx
 * @description Reads stored theme preference, computes the active theme,
 * injects CSS custom properties onto DOM, and exposes context to children.
 */
import React, { useState, useEffect, useCallback } from "react";
import { lightTheme, darkTheme } from "./themeStyles";
import type { Theme } from "./themeStyles";
import {
  ThemeManagerContext,
  ThemeSettings,
  DarkThemeKey,
} from "./ThemeManagerContext";
import type { ThemeSettingValue, ThemeManagerState } from "./ThemeManagerContext";

// Helper to detect if running in a browser environment
const isBrowser = typeof window !== 'undefined';

// Helper to get system dark mode preference
const systemDarkModeSetting = () =>
  isBrowser && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
const isDarkModeActive = () => {
  return !!systemDarkModeSetting()?.matches;
};

// Helper to flatten nested theme tokens into CSS variables and inject into DOM
const flattenThemeTokens = (
  obj: Record<string, unknown>,
  prefix = '',
  target: CSSStyleDeclaration
) => {
  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'object' && value !== null) {
      flattenThemeTokens(value as Record<string, unknown>, name, target);
    } else {
      target.setProperty(
        `--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
        value as string
      );
    }
  }
};

// Helper to apply theme CSS variables to the DOM
const applyThemeToDOM = (theme: string, themeTokens: Theme) => {
  if (!isBrowser) return;
  const root = document.documentElement;

  // attribute setter for CSS selectors and a CSS variable for initial theme
  root.style.setProperty("--initial-color-mode", theme);
  root.setAttribute("data-theme", theme);

  // inject CSS variables from ThemeStyles for the active theme
  flattenThemeTokens(themeTokens as unknown as Record<string, unknown>, '', root.style);
};

const getInitialIsDark = (): boolean => {
  if (!isBrowser) return true;
  const stored = localStorage.getItem(DarkThemeKey) as ThemeSettingValue | null;
  if (stored && stored !== ThemeSettings.SYSTEM) return stored === ThemeSettings.DARK;
  return isDarkModeActive();
};

const getInitialDidLoad = (): boolean => {
  if (!isBrowser) return false;
  return !!localStorage.getItem(DarkThemeKey);
}

const getInitialThemeSettings = (): ThemeSettingValue => {
  if (!isBrowser) return ThemeSettings.SYSTEM;
  const stored = localStorage.getItem(DarkThemeKey) as ThemeSettingValue | null;
  return stored ?? ThemeSettings.SYSTEM;
};

export const ThemeManagerProvider = ({ children }: React.PropsWithChildren) => {
  const [isDark, setIsDark] = useState<boolean>(getInitialIsDark);
  const [didLoad] = useState<boolean>(getInitialDidLoad);
  const [themeSettings, setThemeSettings] = useState<ThemeSettingValue>(getInitialThemeSettings);

  // on mount, read stored theme or system preference and apply to DOM
  useEffect(() => {
    if (!isBrowser) return;

    applyThemeToDOM(
      isDark ? ThemeSettings.DARK : ThemeSettings.LIGHT,
      isDark ? darkTheme : lightTheme
    );
  }, []);

  // toggling function to switch themes and update localStorage
  const toggleDark = useCallback((setting: ThemeSettingValue) => {
    if (!isBrowser) return;

    localStorage.setItem(DarkThemeKey, setting);

    const activeTheme = setting === ThemeSettings.SYSTEM
      ? isDarkModeActive()
      : setting === ThemeSettings.DARK;

    const themeName = activeTheme ? ThemeSettings.DARK : ThemeSettings.LIGHT;
    // update state and apply theme to DOM
    setThemeSettings(setting);
    setIsDark(activeTheme);
    applyThemeToDOM(themeName, activeTheme ? darkTheme : lightTheme);
  }, []);

  const changeThemeSettings = useCallback((setting: ThemeSettingValue) => {
    toggleDark(setting);
  }, [toggleDark]);

  // return context with state and toggling function
  const contextValue: ThemeManagerState = {
    isDark,
    didLoad,
    themeSettings,
    toggleDark,
    changeThemeSettings,
  };

  return (
    <ThemeManagerContext.Provider value={contextValue}>
      {children}
    </ThemeManagerContext.Provider>
  );
};