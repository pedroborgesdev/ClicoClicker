export interface IElectronAPI {
    doThing: () => void;
    minimizeApp: () => void;
    maximizeApp: () => void;
    closeApp: () => void;
    listenForHotkey: () => Promise<string>;
    startClicker: (settings: ClickerSettings) => Promise<void>;
    stopClicker: () => Promise<boolean>;
}

declare global {
    interface Window {
        electron: IElectronAPI;
    }
}
