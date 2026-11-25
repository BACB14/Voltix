const { app, BrowserWindow } = require('electron');
const path = require('path');

// Necesario en Linux para ejecutar desde AppImage sin error de SUID chrome-sandbox
app.commandLine.appendSwitch('no-sandbox');

function createWindow() {
    const win = new BrowserWindow({
        width: 960,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        title: 'Voltix',
        backgroundColor: '#070710',
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
