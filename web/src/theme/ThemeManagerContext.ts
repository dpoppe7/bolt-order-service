/**
 * @file ThemeManagerContext.ts
 * @description Theme context definitions for ThemeManagerProvider.
 * contexts, types, constants related to theme management and toggling logic.
 */
import { createContext } from "react";

export const ThemeSettings = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// union of strings ('light' | 'dark' | 'system')
export type ThemeSettingValue = typeof ThemeSettings[keyof typeof ThemeSettings];

export interface ThemeManagerState {
  isDark: boolean;
  didLoad: boolean;
  themeSettings: ThemeSettingValue;
  toggleDark: (setting: ThemeSettingValue) => void;
  changeThemeSettings: (setting: ThemeSettingValue) => void;
}

export const defaultState: ThemeManagerState = {
  isDark: true,
  didLoad: false,
  themeSettings: ThemeSettings.SYSTEM,
  toggleDark: () => {},
  changeThemeSettings: () => {},
};

export const DarkThemeKey = "theme";
export const ThemeManagerContext = createContext<ThemeManagerState>(defaultState);