const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('appApi', {
  savePageAsPdf: (url) => ipcRenderer.invoke('save-page-as-pdf', url),
  setFrameBypassEnabled: (enabled) => ipcRenderer.invoke('set-frame-bypass-enabled', enabled)
});
