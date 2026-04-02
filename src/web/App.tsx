import { useState, useEffect } from 'react';
import type { DesiredKey, ClickerMode, ClickerSettings, BurstClickerSettings } from './types.ts';

import { THEMES, ThemeName } from './components/Toolbar/Toolbar.tsx';
import Layout from './layout/Layout.tsx';
import AutoClickerPage from './pages/AutoClickerPage.tsx';
import BurstClickerPage from './pages/BurstClickerPage.tsx';

function App() {
  // --- Load persisted settings ---
  const loadSettings = (): Partial<ClickerSettings> => {
    try {
      const saved = localStorage.getItem('clickerSettings');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      return {};
    }
  };

  const loadBurstSettings = (): Partial<BurstClickerSettings> => {
    try {
      const saved = localStorage.getItem('burstClickerSettings');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Failed to load burst settings from localStorage", error);
      return {};
    }
  };

  const initialSettings = loadSettings();
  const initialBurstSettings = loadBurstSettings();

  // --- Mode ---
  const [mode, setMode] = useState<ClickerMode>(() => {
    const saved = localStorage.getItem('clickerMode');
    return (saved === 'auto' || saved === 'burst') ? saved : 'auto';
  });

  // --- Auto Clicker state ---
  const [cps, setCps] = useState<number>(initialSettings.cps ?? 17);
  const [variation, setVariation] = useState<number>(initialSettings.variation ?? 3);
  const [hotkey, setHotkey] = useState<string>(initialSettings.hotkey ?? 'f2');
  const [desiredKey, setDesiredKey] = useState<DesiredKey>(initialSettings.button ?? 'left');
  const [activeOnlyWhenPressed, setActiveOnlyWhenPressed] = useState<boolean>(initialSettings.holdToClick ?? false);

  // --- Burst Clicker state ---
  const [burstClicks, setBurstClicks] = useState<number>(initialBurstSettings.clicks ?? 5);
  const [burstDelay, setBurstDelay] = useState<number>(initialBurstSettings.delay ?? 10);
  const [burstDesiredKey, setBurstDesiredKey] = useState<DesiredKey>(initialBurstSettings.button ?? 'left');

  // --- Shared state ---
  const [isListening, setIsListening] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // --- Theme ---
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('clickerTheme');
    return (saved && THEMES.includes(saved as ThemeName)) ? saved as ThemeName : 'ocean';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('clickerTheme', theme);
  }, [theme]);

  // --- Intro ---
  const [showIntro, setShowIntro] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setIsExiting(true), 2500);
    const unmountTimer = setTimeout(() => setShowIntro(false), 5500);
    return () => { clearTimeout(exitTimer); clearTimeout(unmountTimer); };
  }, []);

  // --- Persist mode ---
  useEffect(() => {
    localStorage.setItem('clickerMode', mode);
  }, [mode]);

  // --- Persist auto clicker settings ---
  useEffect(() => {
    const settings: ClickerSettings = {
      cps, variation, hotkey, button: desiredKey, holdToClick: activeOnlyWhenPressed,
    };
    try { localStorage.setItem('clickerSettings', JSON.stringify(settings)); }
    catch (error) { console.error("Failed to save settings to localStorage", error); }
  }, [cps, variation, hotkey, desiredKey, activeOnlyWhenPressed]);

  // --- Persist burst clicker settings ---
  useEffect(() => {
    const settings: BurstClickerSettings = {
      clicks: burstClicks, delay: burstDelay, button: burstDesiredKey,
    };
    try { localStorage.setItem('burstClickerSettings', JSON.stringify(settings)); }
    catch (error) { console.error("Failed to save burst settings to localStorage", error); }
  }, [burstClicks, burstDelay, burstDesiredKey]);

  // --- Auto Clicker handlers ---
  const handleStartAutoClicker = async () => {
    const settings: ClickerSettings = {
      cps, variation, hotkey, button: desiredKey, holdToClick: activeOnlyWhenPressed,
    };
    try {
      await window.electron.startClicker(settings);
      setIsClicking(true);
    } catch (error) {
      console.error("Erro ao iniciar o auto-clicker:", error);
      setIsClicking(false);
    }
  };

  // --- Burst Clicker handlers ---
  const handleStartBurstClicker = async () => {
    const settings: BurstClickerSettings = {
      clicks: burstClicks, delay: burstDelay, button: burstDesiredKey,
    };
    try {
      await window.electron.startBurstClicker(settings);
      setIsClicking(true);
    } catch (error) {
      console.error("Erro ao iniciar o burst-clicker:", error);
      setIsClicking(false);
    }
  };

  // --- Stop handler (works for both) ---
  const handleStopClicker = async () => {
    try {
      await window.electron.stopClicker();
      setIsClicking(false);
    } catch (error) {
      console.error("Erro ao parar o clicker:", error);
    }
  };

  return (
    <Layout
      theme={theme}
      onThemeChange={setTheme}
      mode={mode}
      onModeChange={setMode}
      showIntro={showIntro}
      isExiting={isExiting}
      isListening={isListening}
      isClicking={isClicking}
    >
      {mode === 'auto' ? (
        <AutoClickerPage
          cps={cps}
          variation={variation}
          hotkey={hotkey}
          desiredKey={desiredKey}
          activeOnlyWhenPressed={activeOnlyWhenPressed}
          isListening={isListening}
          isClicking={isClicking}
          onCpsChange={setCps}
          onVariationChange={setVariation}
          onHotkeyChange={setHotkey}
          onDesiredKeyChange={setDesiredKey}
          onActiveToggle={() => setActiveOnlyWhenPressed(prev => !prev)}
          onIsListeningChange={setIsListening}
          onStart={handleStartAutoClicker}
          onStop={handleStopClicker}
        />
      ) : (
        <BurstClickerPage
          clicks={burstClicks}
          delay={burstDelay}
          desiredKey={burstDesiredKey}
          isClicking={isClicking}
          onClicksChange={setBurstClicks}
          onDelayChange={setBurstDelay}
          onDesiredKeyChange={setBurstDesiredKey}
          onStart={handleStartBurstClicker}
          onStop={handleStopClicker}
        />
      )}
    </Layout>
  );
}

export default App;
