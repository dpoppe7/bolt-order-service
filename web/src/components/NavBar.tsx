import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { Sun, Moon, LayoutDashboard, ShoppingBag, Menu } from 'lucide-react';
import { ThemeManagerContext } from '../theme/ThemeManagerContext';
import { ThemeSettings } from '../theme/ThemeManagerContext';

interface NavbarProps {
  view: 'customer' | 'admin';
  onViewChange: (view: 'customer' | 'admin') => void;
  onHeightChange: (height: number) => void; // exporting scroll height dynamically via ref
};

export function NavBar({view, onViewChange, onHeightChange}: NavbarProps) {
    const {isDark, changeThemeSettings} = useContext(ThemeManagerContext);
    const [isOpen, setIsOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!headerRef.current) return;

        // Measure height and report it. It watches the physical boundaries of an element. 
        // The moment a single pixel changes in the Navbar's height, it triggers a callback.
        const observer = new ResizeObserver(() => {
            if (headerRef.current) {
                onHeightChange(headerRef.current.offsetHeight);
            }
        });

        observer.observe(headerRef.current);

        // cleanup: prevents memory leak, when the user leaves the page, the browser stops watching the element.
        return () => observer.disconnect();
    }, []);

    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    return (
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-50 bg-theme-bg-primary">
        <div className="justify-between flex items-center max-w-7xl mx-auto px-4 sm:px-6 py-3 ">
            {/* Logo/Title */}
            <div className="font-jost text-lg font-medium uppercase text-theme-text-secondary">
                Bolt Order Service
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex items-center gap-4">
                
                {/* Dark/Light Toggle */}
                <button 
                    onClick= {() => changeThemeSettings(isDark ? ThemeSettings.LIGHT : ThemeSettings.DARK)}
                    className="p-2 rounded-full text-theme-text-muted hover:text-theme-text-primary transition-colors"
                >
                    {isDark ? <Sun size={24}/>: <Moon size={24}/>}
                </button>

                {/* View Toggle */}
                <div className="flex gap-2 bg-theme-bg-secondary backdrop-blur-xl rounded-full p-1 border-2 border-theme-border-subtle">
                    <button
                        onClick={() => onViewChange('customer')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        view === 'customer'
                            ? 'bg-theme-accent-blue text-white'
                            : 'text-theme-text-muted hover:text-theme-text-primary '
                        }`}
                    >
                        <ShoppingBag size={18} />
                        <span className="text-sm font-medium uppercase">Store</span>
                    </button>
                    <button
                        onClick={() => onViewChange('admin')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        view === 'admin'
                            ? 'bg-theme-accent-orange text-white'
                            : 'text-theme-text-muted hover:text-theme-text-primary'
                        }`}
                    >
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-medium uppercase">Admin</span>
                    </button>
                </div>
            </div>

            {/* Hamburger button - Mobile View */}
            <button
                onClick={handleClick}
                className='md:hidden text-theme-text-primary'
            >
                <Menu size={24} />
            </button>
        </div>

            {/* Hamburger content */}
            { isOpen && (
                <div className="md:hidden bg-theme-bg-primary px-6 py-4 flex flex-col gap-4  ">
                    <button 
                        onClick= {() => changeThemeSettings(isDark ? ThemeSettings.LIGHT : ThemeSettings.DARK)}
                        className="px-4 rounded-full text-theme-text-muted hover:text-theme-text-primary transition-colors"
                    >
                        {isDark ? <Sun size={24}/>: <Moon size={24}/>}
                    </button>
                    <button
                        onClick={() => onViewChange('customer')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        view === 'customer'
                            ? 'bg-theme-accent-blue text-white'
                            : 'text-theme-text-muted hover:text-theme-text-primary '
                        }`}
                    >
                        <ShoppingBag size={18} />
                        <span className="text-sm font-medium uppercase">Store</span>
                    </button>
                    <button
                        onClick={() => onViewChange('admin')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        view === 'admin'
                            ? 'bg-theme-accent-orange text-white'
                            : 'text-theme-text-muted hover:text-theme-text-primary'
                        }`}
                    >
                        <LayoutDashboard size={18} />
                        <span className="text-sm font-medium uppercase">Admin</span>
                    </button>
                </div>
            )}
    </header>
    )
};