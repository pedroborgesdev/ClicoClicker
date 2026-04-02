import { contextBridge, ipcRenderer } from 'electron';
import { ClickerSettings, BurstClickerSettings } from './types';

contextBridge.exposeInMainWorld('electron', {
    doThing: () => ipcRenderer.invoke('do-thing'),
    minimizeApp: () => ipcRenderer.invoke('minimize-app'),
    maximizeApp: () => ipcRenderer.invoke('maximize-app'),
    closeApp: () => ipcRenderer.invoke('close-app'),
    listenForHotkey: (): Promise<string> => ipcRenderer.invoke('listen-for-hotkey'),
    startClicker: (settings: ClickerSettings) => ipcRenderer.invoke('start-clicker', settings),
    startBurstClicker: (settings: BurstClickerSettings) => ipcRenderer.invoke('start-burst-clicker', settings),
    stopClicker: () => ipcRenderer.invoke('stop-clicker'),
});
