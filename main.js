const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
