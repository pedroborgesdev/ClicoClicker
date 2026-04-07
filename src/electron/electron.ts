import path from 'path';
import { app, BrowserWindow, shell, BrowserWindowConstructorOptions, ipcMain } from 'electron';
import { spawn, ChildProcessWithoutNullStreams, exec } from 'child_process';

const isDev = process.env.IS_DEV === "true";

const clickerProcesses: Map<number, ChildProcessWithoutNullStreams> = new Map();

const scriptPath = isDev
    ? path.join(process.cwd(), 'src', 'scripts')
    : path.join(process.resourcesPath, 'scripts');

const platform = process.platform === 'win32' ? 'win' : 'linux';

const basePath = isDev
    ? path.join(process.cwd(), 'python', platform)
    : path.join(process.resourcesPath, 'python', platform);

const pyPath = process.platform === 'win32'
    ? path.join(basePath, 'python.exe')
    : path.join(basePath, 'bin', 'python3');

function createWindow(): void {
    const windowOptions: BrowserWindowConstructorOptions = {
        width: 530,
        height: 620,
        center: true,
        autoHideMenuBar: true,
        resizable: false,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    }; 

    const mainWindow = new BrowserWindow({ ...windowOptions, show: false });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.webContents.on('before-input-event', (_event, input) => {
        if (input.key === 'F11') {
            _event.preventDefault();
        }
    });

    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: "deny" };
    });

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:4000'
            : `file://${path.join(__dirname, '..', '..', 'build', 'web', 'index.html')}`
    );

    if (isDev) {
        // Here you could open dev tools, for example.
    }
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    for (const proc of clickerProcesses.values()) {
        proc.kill('SIGKILL');
    }
    clickerProcesses.clear();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('minimize-app', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.handle('maximize-app', () => {
    const window = BrowserWindow.getFocusedWindow();
    if (window?.isMaximized()) window.unmaximize();
    else window?.maximize();
});
ipcMain.handle('close-app', () => {
    console.log('[App] Close requested from renderer, terminating all clicker processes and closing app.');
    for (const [sessionId, proc] of clickerProcesses.entries()) {
        console.log(`[App] Terminating clicker process for session ${sessionId} with PID: ${proc.pid}`);
        proc.kill('SIGKILL');
    }
    clickerProcesses.clear();
    BrowserWindow.getFocusedWindow()?.close();
});


ipcMain.handle('listen-for-hotkey', () => {
    return new Promise((resolve, reject) => {
        console.log(`[Listen Hotkey] Executing Binary: listen_hotkey.py`);
        
        const binaryProcess = spawn(pyPath, [path.join(scriptPath, 'listen_hotkey.py')]);

        const cleanup = () => {
            if (!binaryProcess || !binaryProcess.pid || binaryProcess.killed) {
                return;
            }
            
            const pid = binaryProcess.pid;
            let command: string;

            if (process.platform === 'win32') {
                command = `taskkill /PID ${pid} /T /F`;
            } else {
                command = `kill -9 ${pid}`;
            }

            console.log(`[Listen Hotkey] Terminating process tree for PID ${pid} with command: "${command}"`);
            
            exec(command, (error) => {
                if (error) {
                    console.warn(`[Listen Hotkey] Error terminating tree (can be normal): ${error.message}`);
                } else {
                    console.log(`[Listen Hotkey] Process tree for PID ${pid} terminated.`);
                }
            });
        };

        binaryProcess.stdout.once('data', (data) => {
            const key = data.toString().trim();
            if (key) {
                console.log(`[Listen Hotkey] Hotkey Received: ${key}`);
                resolve(key);
                cleanup();
            }
        });
        
        binaryProcess.stderr.once('data', (data) => {
            const errorMsg = data.toString().trim();
            console.error(`[Listen Hotkey] Error in binary: ${errorMsg}`);
            reject(new Error(errorMsg));
            cleanup(); 
        });

        binaryProcess.once('error', (err) => {
            console.error('[Listen Hotkey] Spawn error (could not start):', err);
            reject(new Error(`Failed to start the binary: ${err.message}`));
        });
    });
});

ipcMain.handle('start-clicker', (event, sessionId: number, settings) => {
    const existing = clickerProcesses.get(sessionId);
    if (existing) {
        console.log(`[AutoClicker S${sessionId}] Terminating old process (PID: ${existing.pid}) to start a new one.`);
        existing.removeAllListeners();
        existing.kill('SIGKILL');
        clickerProcesses.delete(sessionId);
    }

    const binaryArgs = [
        '--cps', settings.cps.toString(),
        '--variation', settings.variation.toString(),
        '--hotkey', settings.hotkey,
        '--button', settings.button,
    ];

    if (settings.holdToClick) {
        binaryArgs.push('--hold-to-click');
    }

    console.log(`[Starting AutoClicker S${sessionId}]: auto_clicker.py with args: ${binaryArgs.join(' ')}`);

    const proc = spawn(pyPath, [path.join(scriptPath, 'auto_clicker.py'), ...binaryArgs]);
    clickerProcesses.set(sessionId, proc);
    console.log(`[AutoClicker S${sessionId}] New process started with PID: ${proc.pid}`);

    proc.stdout.on('data', (data) => {
        console.log(`[AutoClicker S${sessionId} Info]: ${data.toString().trim()}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`[AutoClicker S${sessionId} Error]: ${data.toString().trim()}`);
    });

    proc.on('close', (code) => {
        console.log(`[AutoClicker S${sessionId} Finished] Process with PID ${proc.pid} finished with code: ${code}`);
        clickerProcesses.delete(sessionId);
    });

    proc.on('error', (err) => {
        console.error(`[AutoClicker S${sessionId}] Failed to start process: ${err.message}`);
        clickerProcesses.delete(sessionId);
    });
});


ipcMain.handle('start-burst-clicker', (event, sessionId: number, settings) => {
    const existing = clickerProcesses.get(sessionId);
    if (existing) {
        console.log(`[BurstClicker S${sessionId}] Terminating old process (PID: ${existing.pid}) to start a new one.`);
        existing.removeAllListeners();
        existing.kill('SIGKILL');
        clickerProcesses.delete(sessionId);
    }

    const binaryArgs = [
        '--clicks', settings.clicks.toString(),
        '--delay', (settings.delay / 1000).toString(),
        '--button', settings.button,
    ];

    console.log(`[Starting BurstClicker S${sessionId}]: burst_clicker.py with args: ${binaryArgs.join(' ')}`);

    const proc = spawn(pyPath, [path.join(scriptPath, 'burst_clicker.py'), ...binaryArgs]);
    clickerProcesses.set(sessionId, proc);
    console.log(`[BurstClicker S${sessionId}] New process started with PID: ${proc.pid}`);

    proc.stdout.on('data', (data) => {
        console.log(`[BurstClicker S${sessionId} Info]: ${data.toString().trim()}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`[BurstClicker S${sessionId} Error]: ${data.toString().trim()}`);
    });

    proc.on('close', (code) => {
        console.log(`[BurstClicker S${sessionId} Finished] Process with PID ${proc.pid} finished with code: ${code}`);
        clickerProcesses.delete(sessionId);
    });

    proc.on('error', (err) => {
        console.error(`[BurstClicker S${sessionId}] Failed to start process: ${err.message}`);
        clickerProcesses.delete(sessionId);
    });
});


ipcMain.handle('stop-clicker', (event, sessionId: number) => {
    const proc = clickerProcesses.get(sessionId);
    if (!proc || !proc.pid) {
        console.log(`[Clicker S${sessionId}] No valid process to terminate.`);
        return false;
    }

    const pid = proc.pid;
    proc.removeAllListeners();
    clickerProcesses.delete(sessionId);

    console.log(`[Stopping Clicker S${sessionId}] Starting process tree termination for PID: ${pid}`);

    let command: string;

    if (process.platform === 'win32') {
        command = `taskkill /PID ${pid} /T /F`;
    } else {
        command = `kill -9 ${pid}`;
    }

    console.log(`[Stopping Clicker S${sessionId}] Executing command: ${command}`);

    exec(command, (error) => {
        if (error) {
            console.warn(`[Stopping Clicker S${sessionId}] Termination warning (can be normal if already ended): ${error.message}`);
        } else {
            console.log(`[Stopping Clicker S${sessionId}] Process tree for PID ${pid} terminated successfully.`);
        }
    });

    return true;
});