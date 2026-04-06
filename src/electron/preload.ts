import { contextBridge, ipcRenderer } from 'electron';
import { ClickerSettings, BurstClickerSettings } from './types';

contextBridge.exposeInMainWorld('electron', {
    doThing: () => ipcRenderer.invoke('do-thing'),
    minimizeApp: () => ipcRenderer.invoke('minimize-app'),
    maximizeApp: () => ipcRenderer.invoke('maximize-app'),
    closeApp: () => ipcRenderer.invoke('close-app'),
    listenForHotkey: (): Promise<string> => ipcRenderer.invoke('listen-for-hotkey'),
    startClicker: (sessionId: number, settings: ClickerSettings) => ipcRenderer.invoke('start-clicker', sessionId, settings),
    startBurstClicker: (sessionId: number, settings: BurstClickerSettings) => ipcRenderer.invoke('start-burst-clicker', sessionId, settings),
    stopClicker: (sessionId: number) => ipcRenderer.invoke('stop-clicker', sessionId),
});
