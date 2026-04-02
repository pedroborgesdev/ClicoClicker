import React from 'react';
import type { DesiredKey } from '../types';
import MouseDisplay from '../components/MouseDisplay/MouseDisplay.tsx';
import SliderInput from '../components/SliderInput/SliderInput.tsx';
import TestArea from '../components/TestArea/TestArea.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

interface BurstClickerPageProps {
  clicks: number;
  delay: number;
  desiredKey: DesiredKey;
  isClicking: boolean;
  onClicksChange: (value: number) => void;
  onDelayChange: (value: number) => void;
  onDesiredKeyChange: (key: DesiredKey) => void;
  onStart: () => void;
  onStop: () => void;
  canStop: boolean;
}

const BurstClickerPage: React.FC<BurstClickerPageProps> = ({
  clicks,
  delay,
  desiredKey,
  isClicking,
  onClicksChange,
  onDelayChange,
  onDesiredKeyChange,
  onStart,
  onStop,
  canStop,
}) => {
  return (
    <>
      <div className="flex flex-row gap-3 w-full h-[328px]">
        <MouseDisplay desiredKey={desiredKey} />
        <div className="flex-1 flex flex-col gap-2.5 min-w-0 rounded-2xl p-3 border border-white/[0.05]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}>
          <fieldset
            disabled={isClicking}
            className={`group flex flex-col gap-2.5 transition-opacity duration-300 disabled:cursor-default ${
              isClicking ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <SliderInput label="Extra Clicks" value={clicks} onChange={onClicksChange} min={1} max={50} />
            <SliderInput label="Delay (ms)" value={delay} onChange={onDelayChange} min={0} max={100} />

            <div className="flex justify-between items-center">
              <span className="font-medium text-xs text-white/70">Desired Key</span>
              <div className="flex gap-1.5">
                <button onClick={() => onDesiredKeyChange('left')} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${desiredKey === 'left' ? '' : 'border-white/[0.06] text-white/50 group-enabled:hover:text-white/70 group-enabled:hover:border-white/[0.12]'}`} style={desiredKey === 'left' ? { background: `rgba(var(--accent), 0.15)`, color: `rgb(var(--accent))`, borderColor: `rgba(var(--accent), 0.3)`, boxShadow: `0 0 12px rgba(var(--accent), 0.12)` } : { background: 'rgba(255,255,255,0.03)' }}>Left</button>
                <button onClick={() => onDesiredKeyChange('right')} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${desiredKey === 'right' ? '' : 'border-white/[0.06] text-white/50 group-enabled:hover:text-white/70 group-enabled:hover:border-white/[0.12]'}`} style={desiredKey === 'right' ? { background: `rgba(var(--accent-secondary), 0.15)`, color: `rgb(var(--accent-secondary))`, borderColor: `rgba(var(--accent-secondary), 0.3)` } : { background: 'rgba(255,255,255,0.03)' }}>Right</button>
              </div>
            </div>
          </fieldset>

          <div className="mt-auto pt-1 flex gap-2">
            <button
              onClick={onStart}
              disabled={isClicking}
              className={`w-full flex items-center justify-center gap-2 text-white font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs disabled:cursor-not-allowed ${
                !isClicking ? 'hover:brightness-110' : 'opacity-30'
              }`}
              style={{ background: !isClicking ? 'linear-gradient(135deg, var(--accent-gradient-from) 0%, var(--accent-gradient-to) 100%)' : 'rgba(255,255,255,0.05)', boxShadow: !isClicking ? `0 0 16px rgba(var(--accent), 0.2)` : 'none' }}
            >
              <FontAwesomeIcon icon={faPlay} className="text-xs" />
              <span>Start</span>
            </button>
            <button
              onClick={onStop}
              disabled={!canStop}
              className={`w-full flex items-center justify-center gap-2 text-white font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs disabled:cursor-not-allowed ${
                canStop ? 'shadow-[0_0_16px_rgba(239,68,68,0.2)] hover:shadow-[0_0_24px_rgba(239,68,68,0.3)] hover:brightness-110' : 'opacity-30'
              }`}
              style={{ background: canStop ? 'linear-gradient(135deg, #DC4A4A 0%, #C43535 100%)' : 'rgba(255,255,255,0.05)' }}
            >
              <FontAwesomeIcon icon={faStop} className="text-xs" />
              <span>Stop</span>
            </button>
          </div>
        </div>
      </div>
      <TestArea />
    </>
  );
};

export default BurstClickerPage;
