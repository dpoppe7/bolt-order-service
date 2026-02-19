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
    purple: string;
    blueGlow: string;
    purpleGlow: string;
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
    primary: '#ffffff',
    secondary: '#f8fafc',
    surface: '#f1f5f9',
    overlay: 'rgba(255,255,255,0.85)',
  },
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    muted: '#94a3b8',
    inverse: '#ffffff',
  },
  accent: {
    blue: '#3b82f6',
    purple: '#9333ea',
    blueGlow: 'rgba(59,130,246,0.25)',
    purpleGlow: 'rgba(147,51,234,0.25)',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  border: {
    default: '#e2e8f0',
    subtle: '#f1f5f9',
    focus: '#3b82f6',
  },
};

export const darkTheme: Theme = {
  background: {
    primary: '#020617',    
    secondary: '#0f172a',  
    surface: '#1e293b',    
    overlay: 'rgba(15,23,42,0.85)',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    muted: '#64748b',
    inverse: '#0f172a',
  },
  accent: {
    blue: '#3b82f6',
    purple: '#9333ea',
    blueGlow: 'rgba(59,130,246,0.2)',
    purpleGlow: 'rgba(147,51,234,0.2)',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  border: {
    default: '#1e293b',
    subtle: '#0f172a',
    focus: '#3b82f6',
  },
};