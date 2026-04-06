import type { ClickerSettings, BurstClickerSettings } from './types';

export interface IElectronAPI {
    doThing: () => void;
    minimizeApp: () => void;
    maximizeApp: () => void;
    closeApp: () => void;
    listenForHotkey: () => Promise<string>;
    startClicker: (sessionId: number, settings: ClickerSettings) => Promise<void>;
    startBurstClicker: (sessionId: number, settings: BurstClickerSettings) => Promise<void>;
    stopClicker: (sessionId: number) => Promise<boolean>;
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}
