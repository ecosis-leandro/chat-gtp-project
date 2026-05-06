const { app, BrowserWindow, ipcMain, dialog, session } = require('electron');
const path = require('path');

let mainWindow;
let bypassFrameProtectionEnabled = false;

function removeFrameAncestorsFromCsp(cspHeaderValue) {
  return cspHeaderValue
    .split(';')
    .map((directive) => directive.trim())
    .filter((directive) => !directive.toLowerCase().startsWith('frame-ancestors'))
    .join('; ');
}

function enableFrameBypass() {
  if (enableFrameBypass.isRegistered) return;

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    if (!bypassFrameProtectionEnabled) {
      callback({ responseHeaders: details.responseHeaders });
      return;
    }

    const headers = { ...details.responseHeaders };

    delete headers['X-Frame-Options'];
    delete headers['x-frame-options'];

    const cspKey = Object.keys(headers).find(
      (key) => key.toLowerCase() === 'content-security-policy'
    );

    if (cspKey) {
      headers[cspKey] = headers[cspKey]
        .map((value) => removeFrameAncestorsFromCsp(value))
        .filter((value) => value.trim().length > 0);

      if (headers[cspKey].length === 0) {
        delete headers[cspKey];
      }
    }

    callback({ responseHeaders: headers });
  });

  enableFrameBypass.isRegistered = true;
}

enableFrameBypass.isRegistered = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

ipcMain.handle('set-frame-bypass-enabled', (_, enabled) => {
  bypassFrameProtectionEnabled = Boolean(enabled);
  return bypassFrameProtectionEnabled;
});

ipcMain.handle('save-page-as-pdf', async (_, url) => {
  const hiddenWindow = new BrowserWindow({ show: false });

  try {
    await hiddenWindow.loadURL(url);

    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Salvar página como PDF',
      defaultPath: 'pagina.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) {
      return { ok: false, message: 'Operação cancelada.' };
    }

    const pdfBuffer = await hiddenWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4'
    });

    const fs = require('fs/promises');
    await fs.writeFile(filePath, pdfBuffer);

    return { ok: true, message: `PDF salvo em: ${filePath}` };
  } catch (error) {
    return { ok: false, message: `Erro ao gerar PDF: ${error.message}` };
  } finally {
    hiddenWindow.close();
  }
});

app.whenReady().then(() => {
  enableFrameBypass();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
