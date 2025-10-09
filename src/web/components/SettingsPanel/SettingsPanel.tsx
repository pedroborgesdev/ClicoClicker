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
        <div className="flex-1 flex flex-col gap-5 min-w-0 bg-black-dark-700 p-4 rounded-xl shadow-xl">
            <fieldset 
                disabled={isClicking} 
                className={`group flex flex-col gap-5 transition-opacity duration-300 disabled:cursor-default ${
                    isClicking ? 'opacity-40' : 'opacity-100' 
                }`}
            >
                <SliderInput label="CPS (click per second)" value={props.cps} onChange={props.onCpsChange} min={1} max={100}/>
                <SliderInput label="Variation" value={props.variation} onChange={props.onVariationChange} min={0} max={20}/>
                
                <div className="flex justify-between items-center">
                    <span className="font-medium">Activate Hotkey</span>
                    <button 
                        onClick={handleHotkeyButtonClick}
                        disabled={isListening}
                        className={`bg-black-dark-500 group-enabled:hover:bg-black-dark-400 rounded-lg px-4 py-2 font-semibold text-center flex items-center justify-center transition-all w-32 ${isListening ? 'cursor-not-allowed' : ''}`}
                    >
                        {isListening ? 'Listening...' : hotkey}
                    </button>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="font-medium">Desired Key</span>
                    <div className="flex gap-2">
                        <button onClick={() => onDesiredKeyChange('left')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${desiredKey === 'left' ? 'bg-blue-800 text-white' : 'bg-black-dark-500 group-enabled:hover:bg-black-dark-400'}`}>Left</button>
                        <button onClick={() => onDesiredKeyChange('right')} className={`px-6 py-2 rounded-lg font-semibold transition-colors ${desiredKey === 'right' ? 'bg-blue-800 text-white' : 'bg-black-dark-500 group-enabled:hover:bg-black-dark-400'}`}>Right</button>
                    </div>
                </div>

                <div 
                    onClick={!isClicking ? onActiveToggle : undefined} 
                    className={`flex items-center gap-3 group-enabled:cursor-pointer`}
                >
                    <div className={`w-6 h-6 rounded-md flex justify-center items-center transition-colors ${activeOnlyWhenPressed ? 'bg-blue-800' : 'bg-black-dark-500'}`}>
                        {activeOnlyWhenPressed && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="font-medium select-none">Hold to click</span>
                </div>
            </fieldset>

            <div className="mt-2 flex gap-4">
                <button
                    onClick={onStart}
                    disabled={isClicking}
                    className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        !isClicking ? 'bg-blue-800 hover:bg-blue-900' : 'bg-black-dark-500'
                    }`}
                >
                    <FontAwesomeIcon icon={faPlay} />
                    <span>Start</span>
                </button>
                <button
                    onClick={onStop}
                    disabled={!isClicking}
                    className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isClicking ? 'bg-blue-800 hover:bg-blue-900' : 'bg-black-dark-500'
                    }`}
                >
                    <FontAwesomeIcon icon={faStop} />
                    <span>Stop</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsPanel;