import { useState, useEffect } from 'react';
import type { DesiredKey, ClickerSettings } from './types.ts';

import ListeningOverlay from './components/ListeningOverlay/ListeningOverlay.tsx';
import MouseDisplay from './components/MouseDisplay/MouseDisplay.tsx';
import SettingsPanel from './components/SettingsPanel/SettingsPanel.tsx';
import AppInfo from './components/AppInfo/AppInfo.tsx';
import Titlebar from './components/Titlebar/Titlebar.tsx';
import TestArea from './components/TestArea/TestArea.tsx';
import IntroOverlay from './components/IntroOverlay/IntroOverlay.tsx'; // 1. Importe o novo componente

function App() {
  const loadSettings = (): Partial<ClickerSettings> => {
      try {
        const savedSettings = localStorage.getItem('clickerSettings');
        return savedSettings ? JSON.parse(savedSettings) : {};
      } catch (error) {
        console.error("Failed to load settings from localStorage", error);
        return {};
      }
    };

  const initialSettings = loadSettings();

  const [cps, setCps] = useState<number>(initialSettings.cps ?? 17);
  const [variation, setVariation] = useState<number>(initialSettings.variation ?? 3);
  const [hotkey, setHotkey] = useState<string>(initialSettings.hotkey ?? 'f2');
  const [desiredKey, setDesiredKey] = useState<DesiredKey>(initialSettings.button ?? 'left');
  const [activeOnlyWhenPressed, setActiveOnlyWhenPressed] = useState<boolean>(initialSettings.holdToClick ?? false);
  const [isListening, setIsListening] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // 2. Adicione os estados para controlar a tela de introdução
  const [showIntro, setShowIntro] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const settings: ClickerSettings = {
      cps,
      variation,
      hotkey,
      button: desiredKey,
      holdToClick: activeOnlyWhenPressed,
    };
    try {
      localStorage.setItem('clickerSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [cps, variation, hotkey, desiredKey, activeOnlyWhenPressed]);
  
  // 3. Adicione este useEffect para controlar a animação da tela de introdução
  useEffect(() => {
    // Inicia a animação de saída após 2 segundos
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Remove o componente da árvore DOM após a animação terminar (2s + 0.7s de duração da animação)
    const unmountTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    // Limpa os timers se o componente for desmontado
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []); // O array vazio [] garante que isso só rode uma vez

  const handleStartClicker = async () => {
    const settings: ClickerSettings = {
      cps,
      variation,
      hotkey,
      button: desiredKey,
      holdToClick: activeOnlyWhenPressed,
    };
    try {
      await window.electron.startClicker(settings);
      setIsClicking(true);
    } catch (error) {
      console.error("Erro ao iniciar o auto-clicker:", error);
      setIsClicking(false);
    }
  };

  const handleStopClicker = async () => {
    try {
      await window.electron.stopClicker();
      setIsClicking(false);
    } catch (error) {
      console.error("Erro ao parar o auto-clicker:", error);
    }
  };

  return (
    <div className="bg-black-dark-800 min-h-screen flex flex-col font-sans rounded-2xl">
      <Titlebar />

      <div className="relative flex flex-col items-center flex-grow isolate overflow-hidden rounded-b-2xl">
        {/* 4. Renderize o componente condicionalmente aqui */}
        {showIntro && <IntroOverlay isExiting={isExiting} />}
        
        <ListeningOverlay isListening={isListening} />
        
        <main className="flex-grow pt-6 rounded-2xl px-4 w-full max-w-4xl text-gray-200 flex flex-col items-center gap-6">
          <div className="flex flex-row gap-6 w-full">
            <MouseDisplay desiredKey={desiredKey} />
            <SettingsPanel
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
              onStart={handleStartClicker}
              onStop={handleStopClicker}
            />
          </div>
          <TestArea />
        </main>

        <footer className="w-full z-50">
          <AppInfo />
        </footer>
      </div>
    </div>
  );
}

export default App;
