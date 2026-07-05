import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Heart, GraduationCap, DollarSign, History, Moon, Sun, Search, Menu, X } from 'lucide-react';

interface LayoutProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  onSearchClick: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  abaAtiva,
  setAbaAtiva,
  onSearchClick,
  children,
}) => {
  const [tema, setTema] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [menuCelularAberto, setMenuCelularAberto] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (tema === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [tema]);

  const toggleTema = () => {
    setTema(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fisico', label: 'Físico', icon: Heart },
    { id: 'academia', label: 'Acadêmico', icon: GraduationCap },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'historico', label: 'Histórico', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-sm">
              LR
            </div>
            <div>
              <span className="font-bold tracking-tight text-lg text-slate-900 dark:text-white">Life Radar</span>
              <span className="text-[10px] font-mono block text-cyan-600 dark:text-cyan-400 -mt-1 font-semibold">v1.0 PERFORMANCE</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = abaAtiva === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAbaAtiva(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
                  }`}
                  id={`nav-tab-${item.id}`}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={onSearchClick}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Buscar"
              id="global-search-btn"
            >
              <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTema}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Alternar Tema"
              id="theme-toggle-btn"
            >
              {tema === 'light' ? (
                <Moon className="w-4.5 h-4.5" strokeWidth={1.5} />
              ) : (
                <Sun className="w-4.5 h-4.5" strokeWidth={1.5} />
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuCelularAberto(!menuCelularAberto)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Abrir Menu"
              id="mobile-menu-btn"
            >
              {menuCelularAberto ? (
                <X className="w-4.5 h-4.5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-4.5 h-4.5" strokeWidth={1.5} />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {menuCelularAberto && (
        <div className="md:hidden fixed inset-0 z-30 pt-16 bg-slate-950/20 backdrop-blur-sm animate-fade-in" onClick={() => setMenuCelularAberto(false)}>
          <div 
            className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-4 space-y-1 shadow-lg"
            onClick={e => e.stopPropagation()}
          >
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = abaAtiva === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAbaAtiva(item.id);
                    setMenuCelularAberto(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50'
                  }`}
                  id={`mobile-nav-tab-${item.id}`}
                >
                  <Icon className="w-4.5 h-4.5" strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-6 text-center text-xs text-slate-400 dark:text-slate-600 font-mono">
        <div>LIFE RADAR &copy; {new Date().getFullYear()} &bull; METRIC ANALYSIS ENGINE</div>
      </footer>
    </div>
  );
};
