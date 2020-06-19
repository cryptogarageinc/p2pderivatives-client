import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import * as isDev from 'electron-is-dev'
import { initialize, finalize } from './initialize'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: { nodeIntegration: true },
  })
  initialize(mainWindow)
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:9000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  mainWindow.webContents.toggleDevTools()
  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createWindow)

app.on('window-all-closed', async () => {
  await finalize()
  if (process.platform !== 'darwin') {
    finalize()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
