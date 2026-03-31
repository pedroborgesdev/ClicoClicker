import path from 'path';
import { app, BrowserWindow, shell, BrowserWindowConstructorOptions, ipcMain } from 'electron';
import { spawn, ChildProcessWithoutNullStreams, exec } from 'child_process';

const isDev = process.env.IS_DEV === "true";

let clickerProcess: ChildProcessWithoutNullStreams | null = null;

const scriptPath = isDev
    ? path.join(process.cwd(), 'src', 'scripts')
    : path.join(process.resourcesPath, 'scripts');

const basePath = isDev
    ? path.join(process.cwd(), 'src', 'python', 'Scripts')
    : path.join(process.resourcesPath, 'python', 'Scripts');

const pyPath = path.join(basePath, 'python.exe');

function createWindow(): void {
    const windowOptions: BrowserWindowConstructorOptions = {
        width: 520,
        height: 640,
        center: true,
        autoHideMenuBar: true,
        resizable: false,
        frame: false,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    }; 

    const mainWindow = new BrowserWindow(windowOptions);

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
    if (clickerProcess) {
        clickerProcess.kill('SIGKILL');
    }
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
ipcMain.handle('close-app', () => BrowserWindow.getFocusedWindow()?.close());


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
                command = `pkill -P ${pid}`;
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

ipcMain.handle('start-clicker', (event, settings) => {
    if (clickerProcess) {
        console.log(`[AutoClicker] Terminating old process (PID: ${clickerProcess.pid}) to start a new one.`);

        clickerProcess.removeAllListeners(); 
        clickerProcess.kill('SIGKILL');
        clickerProcess = null; 
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

    console.log(`[Starting AutoClicker]: auto_clicker.py with args: ${binaryArgs.join(' ')}`);

    clickerProcess = spawn(pyPath, [path.join(scriptPath, 'auto_clicker.py'), ...binaryArgs]);
    console.log(`[AutoClicker] New process started with PID: ${clickerProcess.pid}`);

    clickerProcess.stdout.on('data', (data) => {
        console.log(`[AutoClicker Info]: ${data.toString().trim()}`);
    });
    clickerProcess.stderr.on('data', (data) => {
        console.error(`[AutoClicker Error]: ${data.toString().trim()}`);
    });
    
    clickerProcess.on('close', (code) => {
        console.log(`[AutoClicker Finished] Process with PID ${clickerProcess?.pid} finished with code: ${code}`);
        clickerProcess = null; 
    });

    clickerProcess.on('error', (err) => {
        console.error(`[AutoClicker] Failed to start process: ${err.message}`);
        clickerProcess = null;
    });
});


ipcMain.handle('stop-clicker', () => {
    if (!clickerProcess || !clickerProcess.pid) {
        console.log('[AutoClicker] No valid process to terminate.');
        return false;
    }

    const pid = clickerProcess.pid;
    console.log(`[Stopping Autoclicker] Starting process tree termination for PID: ${pid}`);

    let command: string;

    if (process.platform === 'win32') {
        command = `taskkill /PID ${pid} /T /F`;
    } else {
        command = `pkill -P ${pid}`;
    }

    console.log(`[Stopping Autoclicker] Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            if (stdout || stderr) {
                console.warn(`[Stopping Autoclicker] Command executed with output/error (can be normal if the process has already ended): ${error.message}`);
            }
        } else {
            console.log(`[Stopping Autoclicker] Process tree for PID ${pid} terminated successfully.`);
        }
        
        if (clickerProcess && clickerProcess.pid === pid) {
            clickerProcess = null;
        }
    });

    return true;
});