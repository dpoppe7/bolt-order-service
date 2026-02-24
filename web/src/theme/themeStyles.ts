/**
2 * @file ThemeStyles.ts
3 * @description Design token definitions for light and dark themes.
5 */

export interface Theme {
  background: {
    primary: string;
    secondary: string; 
    surface: string;    
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  accent: {
    blue: string;
    orange: string;
    blueGlow: string;
    orangeGlow: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  border: {
    default: string;
    subtle: string;
    focus: string;
  };
}

export const lightTheme: Theme = {
  background: {
    primary: '#faefee',
    secondary: '#F0E7E2',
    surface: '#f1f5f9',
    overlay: 'rgba(255,255,255,0.85)',
  },
  text: {
    primary: '#0f172a',
    secondary: '#8D8A8A',
    muted: '#6E6B6A',
    inverse: '#ffffff',
  },
  accent: {
    blue: '#7e8fdd',
    orange: '#E48B58',
    blueGlow: 'rgba(59,130,246,0.25)',
    orangeGlow: 'rgba(147,51,234,0.25)',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  border: {
    default: '#e2e8f0',
    subtle: '#D2C5C1',
    focus: '#677BD8',
  },
};

export const darkTheme: Theme = {
  background: {
    primary: '#0a0a0a',    
    secondary: '#171415',  
    surface: '#1e293b',    
    overlay: 'rgba(15,23,42,0.85)',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#9A9A9A',
    muted: '#C0C0C0',
    inverse: '#0f172a',
  },
  accent: {
    blue: '#677BD8',
    orange: '#E48B58',
    blueGlow: 'rgba(103,123,216,0.2)',
    orangeGlow: 'rgba(147,51,234,0.2)',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  border: {
    default: '#1e293b',
    subtle: '#312B2D',
    focus: '#677BD8',
  },
};