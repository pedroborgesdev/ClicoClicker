import React from 'react';
import { DesiredKey } from "../../types";
import SliderInput from "../SliderInput/SliderInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

interface SettingsPanelProps {
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

const SettingsPanel: React.FC<SettingsPanelProps> = (props) => {
    const { 
        isClicking,
        onActiveToggle,
        isListening,
        onIsListeningChange,
        hotkey,
        desiredKey,
        onDesiredKeyChange,
        activeOnlyWhenPressed,
        onStart,
        onStop,
    } = props;
    
    const handleHotkeyButtonClick = async () => {
        if (isListening || isClicking) return;

        onIsListeningChange(true);
        try {
            const key = await window.electron.listenForHotkey();
            props.onHotkeyChange(key);
        } catch (error) {
            console.error("Falha ao escutar pela hotkey:", error);
        } finally {
            onIsListeningChange(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-2.5 min-w-0 rounded-2xl p-3 border border-white/[0.05]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}>
            <fieldset 
                disabled={isClicking} 
                className={`group flex flex-col gap-2.5 transition-opacity duration-300 disabled:cursor-default ${
                    isClicking ? 'opacity-40' : 'opacity-100' 
                }`}
            >
                <SliderInput label="CPS (click per second)" value={props.cps} onChange={props.onCpsChange} min={1} max={100}/>
                <SliderInput label="Variation" value={props.variation} onChange={props.onVariationChange} min={0} max={20}/>
                
                <div className="flex justify-between items-center">
                    <span className="font-medium text-xs text-white/70">Activate Hotkey</span>
                    <button 
                        onClick={handleHotkeyButtonClick}
                        disabled={isListening}
                        className={`rounded-xl px-3 py-1.5 font-semibold text-xs text-center flex items-center justify-center transition-all duration-200 w-24 border border-white/[0.06] ${isListening ? 'cursor-not-allowed text-white/30' : 'text-white/80 hover:border-white/[0.12] hover:bg-white/[0.04]'}`}
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                        {isListening ? 'Listening...' : hotkey}
                    </button>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="font-medium text-xs text-white/70">Desired Key</span>
                    <div className="flex gap-1.5">
                        <button onClick={() => onDesiredKeyChange('left')} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${desiredKey === 'left' ? '' : 'border-white/[0.06] text-white/50 group-enabled:hover:text-white/70 group-enabled:hover:border-white/[0.12]'}`} style={desiredKey === 'left' ? { background: `rgba(var(--accent), 0.15)`, color: `rgb(var(--accent))`, borderColor: `rgba(var(--accent), 0.3)`, boxShadow: `0 0 12px rgba(var(--accent), 0.12)` } : { background: 'rgba(255,255,255,0.03)' }}>Left</button>
                        <button onClick={() => onDesiredKeyChange('right')} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${desiredKey === 'right' ? '' : 'border-white/[0.06] text-white/50 group-enabled:hover:text-white/70 group-enabled:hover:border-white/[0.12]'}`} style={desiredKey === 'right' ? { background: `rgba(var(--accent-secondary), 0.15)`, color: `rgb(var(--accent-secondary))`, borderColor: `rgba(var(--accent-secondary), 0.3)`, boxShadow: `0 0 12px rgba(var(--accent-secondary), 0.12)` } : { background: 'rgba(255,255,255,0.03)' }}>Right</button>
                    </div>
                </div>

                <div 
                    onClick={!isClicking ? onActiveToggle : undefined} 
                    className={`flex items-center gap-3 group-enabled:cursor-pointer`}
                >
                    <div className={`w-4 h-4 rounded-md flex justify-center items-center transition-all duration-200 border ${activeOnlyWhenPressed ? '' : 'border-white/[0.1] bg-white/[0.03]'}`} style={activeOnlyWhenPressed ? { background: `rgba(var(--accent), 0.2)`, borderColor: `rgba(var(--accent), 0.4)` } : {}}>
                        {activeOnlyWhenPressed && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" style={{ color: `rgb(var(--accent))` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="font-medium text-xs text-white/70 select-none">Hold to click</span>
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
                    disabled={!isClicking}
                    className={`w-full flex items-center justify-center gap-2 text-white font-bold py-2 px-3 rounded-xl transition-all duration-200 text-xs disabled:cursor-not-allowed ${
                        isClicking ? 'shadow-[0_0_16px_rgba(239,68,68,0.2)] hover:shadow-[0_0_24px_rgba(239,68,68,0.3)] hover:brightness-110' : 'opacity-30'
                    }`}
                    style={{ background: isClicking ? 'linear-gradient(135deg, #DC4A4A 0%, #C43535 100%)' : 'rgba(255,255,255,0.05)' }}
                >
                    <FontAwesomeIcon icon={faStop} className="text-xs" />
                    <span>Stop</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;