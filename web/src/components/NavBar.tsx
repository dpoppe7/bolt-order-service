import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Sun, Moon, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { ThemeManagerContext } from '../theme/ThemeManagerContext';
import { ThemeSettings } from '../theme/ThemeManagerContext';
import { ThemeManagerProvider } from '../theme/ThemeManagerProvider';

interface NavbarProps {
  view: 'customer' | 'admin';
  onViewChange: (view: 'customer' | 'admin') => void;
};

export function NavBar({view, onViewChange}: NavbarProps) {
    const {isDark, changeThemeSettings} = useContext(ThemeManagerContext);

    return (
    <header className="fixed top-0 left-0 w-full z-50 bg-theme-bg-primary backdrop-blur-xl">
        <div className="justify-between flex items-center max-w-7xl mx-auto px-4 py-3">
            {/* Logo/Title */}
            <div className="font-jost text-lg font-semibold uppercase text-theme-text-primary">
                Bolt Order Service
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex items-center gap-2">
                
                {/* Dark/Light Toggle */}
                <button 
                    onClick= {() => changeThemeSettings(isDark ? ThemeSettings.LIGHT : ThemeSettings.DARK)}
                    className="p-2 rounded-full text-theme-text-primary hover:text-theme-text-secondary transition-colors"
                >
                    {isDark ? <Sun size={20}/>: <Moon size={20}/>}
                </button>

                {/* View Toggle */}
                <div className="flex gap-2 bg-theme-bg-secondary backdrop-blur-xl rounded-full p-1 border border-theme-border-subtle">
                    <button
                        onClick={() => onViewChange('customer')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        view === 'customer'
                            ? 'bg-theme-accent-blue text-white'
                            : 'text-theme-text-muted hover:text-white'
                        }`}
                    >
                        <ShoppingBag size={18} />
                        <span className="text-sm font-medium">Store</span>
                    </button>
                    <button
                        onClick={() => onViewChange('admin')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        view === 'admin'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                            : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-medium">Admin</span>
                    </button>
                </div>
            </div>
        </div>
    </header>
    )
};