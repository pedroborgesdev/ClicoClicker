import React from 'react';
import type { DesiredKey } from '../types';
import MouseDisplay from '../components/MouseDisplay/MouseDisplay.tsx';
import SettingsPanel from '../components/SettingsPanel/SettingsPanel.tsx';
import TestArea from '../components/TestArea/TestArea.tsx';

interface AutoClickerPageProps {
  cps: number;
  variation: number;
  hotkey: string;
  desiredKey: DesiredKey;
  activeOnlyWhenPressed: boolean;
  isListening: boolean;
  isClicking: boolean;
  onCpsChange: (value: number) => void;
  onVariationChange: (value: number) => void;
  onHotkeyChange: (key: string) => void;
  onDesiredKeyChange: (key: DesiredKey) => void;
  onActiveToggle: () => void;
  onIsListeningChange: (isListening: boolean) => void;
  onStart: () => void;
  onStop: () => void;
}

const AutoClickerPage: React.FC<AutoClickerPageProps> = (props) => {
  return (
    <>
      <div className="flex flex-row gap-3 w-full h-[328px]">
        <MouseDisplay desiredKey={props.desiredKey} />
        <SettingsPanel
          cps={props.cps}
          variation={props.variation}
          hotkey={props.hotkey}
          desiredKey={props.desiredKey}
          activeOnlyWhenPressed={props.activeOnlyWhenPressed}
          isListening={props.isListening}
          isClicking={props.isClicking}
          onCpsChange={props.onCpsChange}
          onVariationChange={props.onVariationChange}
          onHotkeyChange={props.onHotkeyChange}
          onDesiredKeyChange={props.onDesiredKeyChange}
          onActiveToggle={props.onActiveToggle}
          onIsListeningChange={props.onIsListeningChange}
          onStart={props.onStart}
          onStop={props.onStop}
        />
      </div>
      <TestArea />
    </>
  );
};

export default AutoClickerPage;
