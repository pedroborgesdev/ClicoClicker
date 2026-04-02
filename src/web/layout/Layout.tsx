import React from 'react';
import type { ClickerMode } from '../types';
import Titlebar from '../components/Titlebar/Titlebar.tsx';
import Toolbar, { ThemeName } from '../components/Toolbar/Toolbar.tsx';
import AppInfo from '../components/AppInfo/AppInfo.tsx';
import IntroOverlay from '../components/IntroOverlay/IntroOverlay.tsx';
import ListeningOverlay from '../components/ListeningOverlay/ListeningOverlay.tsx';

interface LayoutProps {
  children: React.ReactNode;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  mode: ClickerMode;
  onModeChange: (mode: ClickerMode) => void;
  showIntro: boolean;
  isExiting: boolean;
  isListening: boolean;
  isClicking: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  theme,
  onThemeChange,
  mode,
  onModeChange,
  showIntro,
  isExiting,
  isListening,
  isClicking,
}) => {
  return (
    <div className="h-screen flex flex-col font-sans rounded-2xl overflow-hidden" style={{ background: 'var(--bg-gradient)' }}>
      <Titlebar />
      <Toolbar currentTheme={theme} onChangeTheme={onThemeChange} />

      <div className="relative flex flex-col isolate overflow-hidden rounded-b-2xl flex-1">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: `radial-gradient(circle, var(--accent-hex) 0%, transparent 70%)` }} />

        {showIntro && <IntroOverlay isExiting={isExiting} />}

        <ListeningOverlay isListening={isListening} />

        <main className="flex-1 pt-3 px-4 w-full max-w-4xl mx-auto text-gray-200 flex flex-col items-center gap-3 overflow-y-auto">
          {/* Mode Selector */}
          <div className="flex w-full rounded-xl p-0.5 border border-white/[0.05]" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <button
              onClick={() => !isClicking && onModeChange('auto')}
              disabled={isClicking}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                mode === 'auto' ? '' : 'text-white/40 hover:text-white/60'
              } ${isClicking ? 'cursor-not-allowed' : ''}`}
              style={mode === 'auto' ? {
                background: `rgba(var(--accent), 0.12)`,
                color: `rgb(var(--accent))`,
                boxShadow: `0 0 12px rgba(var(--accent), 0.08)`
              } : {}}
            >
              Auto Clicker
            </button>
            <button
              onClick={() => !isClicking && onModeChange('burst')}
              disabled={isClicking}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                mode === 'burst' ? '' : 'text-white/40 hover:text-white/60'
              } ${isClicking ? 'cursor-not-allowed' : ''}`}
              style={mode === 'burst' ? {
                background: `rgba(var(--accent), 0.12)`,
                color: `rgb(var(--accent))`,
                boxShadow: `0 0 12px rgba(var(--accent), 0.08)`
              } : {}}
            >
              Burst Clicker
            </button>
          </div>

          {children}
        </main>

        <footer className="w-full z-10">
          <AppInfo />
        </footer>
      </div>
    </div>
  );
};

export default Layout;
