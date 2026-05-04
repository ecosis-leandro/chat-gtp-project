const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appApi', {
  savePageAsPdf: (url) => ipcRenderer.invoke('save-page-as-pdf', url)
});
