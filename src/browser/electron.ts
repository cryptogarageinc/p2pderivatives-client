import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import url from 'url'
import initialize from './initialize'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: { nodeIntegration: true },
  })
  initialize()
  let startUrl = url.format({
    pathname: path.join(__dirname, '/../index.html'),
    protocol: 'file:',
    slashes: true,
  })
  if (!app.isPackaged) {
    startUrl = 'http://localhost:9000'
    mainWindow.webContents.toggleDevTools()
  }
  mainWindow.loadURL(startUrl)
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
