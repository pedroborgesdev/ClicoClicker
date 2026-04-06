import { useState, useEffect, useCallback } from 'react';
import type { DesiredKey, ClickerMode, ClickerSettings, BurstClickerSettings } from './types.ts';

import { THEMES, ThemeName } from './components/Toolbar/Toolbar.tsx';
import Layout from './layout/Layout.tsx';
import AutoClickerPage from './pages/AutoClickerPage.tsx';
import BurstClickerPage from './pages/BurstClickerPage.tsx';
import Sidebar from './components/Sidebar/Sidebar.tsx';

interface SessionData {
  id: number;
  mode: ClickerMode;
  cps: number;
  variation: number;
  hotkey: string;
  desiredKey: DesiredKey;
  holdToClick: boolean;
  burstClicks: number;
  burstDelay: number;
  burstDesiredKey: DesiredKey;
  isClicking: boolean;
  canStop: boolean;
}

const MAX_SESSIONS = 5;

const createDefaultSession = (id: number): SessionData => ({
  id,
  mode: 'auto',
  cps: 17,
  variation: 3,
  hotkey: 'f2',
  desiredKey: 'left',
  holdToClick: false,
  burstClicks: 5,
  burstDelay: 10,
  burstDesiredKey: 'left',
  isClicking: false,
  canStop: false,
});

const loadSessions = (): SessionData[] => {
  try {
    const saved = localStorage.getItem('clickerSessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((s: any) => ({
        ...createDefaultSession(s.id),
        ...s,
        isClicking: false,
        canStop: false,
      }));
    }

    // Migrate from old format
    const session = createDefaultSession(1);
    try {
      const oldAuto = localStorage.getItem('clickerSettings');
      if (oldAuto) {
        const auto = JSON.parse(oldAuto);
        if (auto.cps != null) session.cps = auto.cps;
        if (auto.variation != null) session.variation = auto.variation;
        if (auto.hotkey != null) session.hotkey = auto.hotkey;
        if (auto.button != null) session.desiredKey = auto.button;
        if (auto.holdToClick != null) session.holdToClick = auto.holdToClick;
      }
    } catch { /* ignore */ }
    try {
      const oldBurst = localStorage.getItem('burstClickerSettings');
      if (oldBurst) {
        const burst = JSON.parse(oldBurst);
        if (burst.clicks != null) session.burstClicks = burst.clicks;
        if (burst.delay != null) session.burstDelay = burst.delay;
        if (burst.button != null) session.burstDesiredKey = burst.button;
      }
    } catch { /* ignore */ }
    const oldMode = localStorage.getItem('clickerMode');
    if (oldMode === 'auto' || oldMode === 'burst') session.mode = oldMode;

    return [session];
  } catch {
    return [createDefaultSession(1)];
  }
};

function App() {
  const [sessions, setSessions] = useState<SessionData[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<number>(1);
  const [isListening, setIsListening] = useState(false);

  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('clickerTheme');
    return (saved && THEMES.includes(saved as ThemeName)) ? saved as ThemeName : 'ocean';
  });

  const [showIntro, setShowIntro] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clickerTheme', theme);
  }, [theme]);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), 2500);
    const unmountTimer = setTimeout(() => setShowIntro(false), 5500);
    return () => { clearTimeout(exitTimer); clearTimeout(unmountTimer); };
  }, []);

  // Persist sessions to localStorage (exclude runtime state)
  useEffect(() => {
    const toSave = sessions.map(({ isClicking, canStop, ...config }) => config);
    try { localStorage.setItem('clickerSessions', JSON.stringify(toSave)); }
    catch (error) { console.error("Failed to save sessions to localStorage", error); }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId)!;

  const updateSession = useCallback((id: number, updates: Partial<SessionData>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const addSession = () => {
    if (sessions.length >= MAX_SESSIONS) return;
    const newId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1;
    const newSession = createDefaultSession(newId);
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newId);
  };

  const deleteSession = async (id: number) => {
    if (sessions.length <= 1) return;
    const session = sessions.find(s => s.id === id);
    if (session?.isClicking) {
      try { await window.electron.stopClicker(id); } catch { /* ignore */ }
    }
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, i) => ({ ...s, id: i + 1 }));
    });
    setActiveSessionId(prev => {
      const remaining = sessions.filter(s => s.id !== id);
      if (prev === id) return remaining.length > 0 ? Math.min(...remaining.map(s => s.id)) : 1;
      const newIndex = sessions.filter(s => s.id !== id).findIndex(s => s.id === prev);
      return newIndex + 1;
    });
  };

  const handleStartAutoClicker = async () => {
    const sid = activeSession.id;
    const settings: ClickerSettings = {
      cps: activeSession.cps,
      variation: activeSession.variation,
      hotkey: activeSession.hotkey,
      button: activeSession.desiredKey,
      holdToClick: activeSession.holdToClick,
    };
    try {
      await window.electron.startClicker(sid, settings);
      updateSession(sid, { isClicking: true });
      setTimeout(() => updateSession(sid, { canStop: true }), 500);
    } catch (error) {
      console.error("Erro ao iniciar o auto-clicker:", error);
      updateSession(sid, { isClicking: false });
    }
  };

  const handleStartBurstClicker = async () => {
    const sid = activeSession.id;
    const settings: BurstClickerSettings = {
      clicks: activeSession.burstClicks,
      delay: activeSession.burstDelay,
      button: activeSession.burstDesiredKey,
    };
    try {
      await window.electron.startBurstClicker(sid, settings);
      updateSession(sid, { isClicking: true });
      setTimeout(() => updateSession(sid, { canStop: true }), 500);
    } catch (error) {
      console.error("Erro ao iniciar o burst-clicker:", error);
      updateSession(sid, { isClicking: false });
    }
  };

  const handleStopClicker = async () => {
    const sid = activeSession.id;
    try {
      await window.electron.stopClicker(sid);
      updateSession(sid, { isClicking: false, canStop: false });
    } catch (error) {
      console.error("Erro ao parar o clicker:", error);
    }
  };

  const sidebar = (
    <Sidebar
      sessions={sessions.map(s => ({ id: s.id, isClicking: s.isClicking }))}
      activeSessionId={activeSessionId}
      onSelectSession={setActiveSessionId}
      onAddSession={addSession}
      onDeleteSession={deleteSession}
      canAddSession={sessions.length < MAX_SESSIONS}
    />
  );

  return (
    <Layout
      theme={theme}
      onThemeChange={setTheme}
      mode={activeSession.mode}
      onModeChange={(mode) => updateSession(activeSession.id, { mode })}
      showIntro={showIntro}
      isExiting={isExiting}
      isListening={isListening}
      isClicking={activeSession.isClicking}
      sidebar={sidebar}
    >
      {activeSession.mode === 'auto' ? (
        <AutoClickerPage
          cps={activeSession.cps}
          variation={activeSession.variation}
          hotkey={activeSession.hotkey}
          desiredKey={activeSession.desiredKey}
          activeOnlyWhenPressed={activeSession.holdToClick}
          isListening={isListening}
          isClicking={activeSession.isClicking}
          onCpsChange={(cps) => updateSession(activeSession.id, { cps })}
          onVariationChange={(variation) => updateSession(activeSession.id, { variation })}
          onHotkeyChange={(hotkey) => updateSession(activeSession.id, { hotkey })}
          onDesiredKeyChange={(desiredKey) => updateSession(activeSession.id, { desiredKey })}
          onActiveToggle={() => updateSession(activeSession.id, { holdToClick: !activeSession.holdToClick })}
          onIsListeningChange={setIsListening}
          onStart={handleStartAutoClicker}
          onStop={handleStopClicker}
          canStop={activeSession.canStop}
        />
      ) : (
        <BurstClickerPage
          clicks={activeSession.burstClicks}
          delay={activeSession.burstDelay}
          desiredKey={activeSession.burstDesiredKey}
          isClicking={activeSession.isClicking}
          onClicksChange={(burstClicks) => updateSession(activeSession.id, { burstClicks })}
          onDelayChange={(burstDelay) => updateSession(activeSession.id, { burstDelay })}
          onDesiredKeyChange={(burstDesiredKey) => updateSession(activeSession.id, { burstDesiredKey })}
          onStart={handleStartBurstClicker}
          onStop={handleStopClicker}
          canStop={activeSession.canStop}
        />
      )}
    </Layout>
  );
}

export default App;
