import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette } from '@fortawesome/free-solid-svg-icons';

export const THEMES = ['ocean', 'crimson', 'emerald', 'violet', 'amber'] as const;
export type ThemeName = typeof THEMES[number];

const THEME_COLORS: Record<ThemeName, string> = {
  ocean:   '#5B8DEF',
  crimson: '#EF4444',
  emerald: '#34D399',
  violet:  '#A855F7',
  amber:   '#F59E0B',
};

const THEME_LABELS: Record<ThemeName, string> = {
  ocean:   'Ocean',
  crimson: 'Crimson',
  emerald: 'Emerald',
  violet:  'Violet',
  amber:   'Amber',
};

interface ToolbarProps {
  currentTheme: ThemeName;
  onChangeTheme: (theme: ThemeName) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ currentTheme, onChangeTheme }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className="w-full flex items-center justify-between px-4 h-8 border-b border-white/[0.03]"
      style={{ background: 'rgba(255,255,255,0.015)' }}
    >
      {/* Left — GitHub links, icon only */}
      <div className="no-drag flex items-center gap-1.5">
        <a
          href="https://github.com/pedroborgesdev/ClicoClicker.git"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold tracking-wide text-white/35 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/60 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>Repo</span>
        </a>
        <a
          href="https://github.com/pedroborgesdev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold tracking-wide text-white/35 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/60 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>Author</span>
        </a>
        <a
          href="https://clicoclicker.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold tracking-wide text-white/35 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/60 transition-all duration-200"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>ClicoClicker.com</span>
        </a>
      </div>

      {/* Right — Theme label + selector */}
      <div className="no-drag flex items-center gap-2">
        <FontAwesomeIcon icon={faPalette} className="text-[10px] text-white/25" />
        <span className="text-[10px] text-white/20 font-medium tracking-widest uppercase">Theme</span>

        <div className="relative" ref={ref}>
          {/* Trigger */}
          <button
            onClick={() => setOpen(prev => !prev)}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-lg text-[11px] font-semibold tracking-wide border transition-all duration-200 cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: open ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
              color: open ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{ background: THEME_COLORS[currentTheme] }}
            />
            <span className="w-14 text-left">{THEME_LABELS[currentTheme]}</span>
            <svg
              className={`w-3 h-3 text-white/25 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="absolute right-0 mt-1.5 w-40 rounded-xl py-1 z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, var(--dropdown-from) 0%, var(--dropdown-to) 100%)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'var(--dropdown-border)',
                backdropFilter: 'blur(16px)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.05), 0 0 20px rgba(var(--accent), 0.04)`,
              }}
            >
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => { onChangeTheme(t); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-[11px] font-semibold tracking-wide transition-all duration-150 ${
                    currentTheme === t ? 'text-white/90' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
                  style={currentTheme === t ? { background: `rgba(${THEME_COLORS[t].replace('#', '').match(/.{2}/g)!.map(h => parseInt(h, 16)).join(',')}, 0.1)` } : {}}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300"
                    style={{
                      background: THEME_COLORS[t],
                      boxShadow: currentTheme === t ? `0 0 8px ${THEME_COLORS[t]}60` : 'none',
                    }}
                  />
                  <span>{THEME_LABELS[t]}</span>
                  {currentTheme === t && (
                    <svg className="w-3 h-3 ml-auto" style={{ color: THEME_COLORS[t] }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
