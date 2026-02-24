/**
2 * @file ThemeStyles.ts
3 * @description Design token definitions for light and dark themes.
5 */

export interface Theme {
  background: {
    primary: string;
    secondary: string; 
    surface: string;  
    surfaceMuted: string;  
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  accent: {
    primary: string;
    secondary: string;
    primaryMuted: string;
    secondaryMuted: string;
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
    primary: '#E8DFDE',
    secondary: '#F0E7E2',
    surface: '#E0D5CF',
    surfaceMuted: '#D7CCC8',
    overlay: 'rgba(255,255,255,0.85)',
  },
  text: {
    primary: '#0f172a',
    secondary: '#8D8A8A',
    muted: '#6E6B6A',
    inverse: '#ffffff',
  },
  accent: {
    primary: '#7e8fdd',
    secondary: '#E48B58',
    primaryMuted: '#5164BD',
    secondaryMuted: '#AF6338',
  },
  status: {
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#2563eb',
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
    surface: '#1F1C1D',    
    surfaceMuted: '#27272a',
    overlay: 'rgba(15,23,42,0.85)',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#9A9A9A',
    muted: '#C0C0C0',
    inverse: '#0f172a',
  },
  accent: {
    primary: '#677BD8',
    secondary: '#E48B58',
    primaryMuted: '#5164BD',
    secondaryMuted: '#AF6338',
  },
  status: {
    success: '#16a34a',
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