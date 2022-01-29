// Ref: https://tombuyse.blog/blog/using-electron-with-react-and-node

// 3rd Party
const electron = require('electron');
import { app, BrowserWindow } from 'electron'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

/**
 * Our main createWindow function to populate our main window
 */
function createWindow() {
    const [ width, height ] = getRealScreen()

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: width, 
        height: height,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: true,
            webviewTag: true,
            scrollBounce: true
        },
        // titleBarStyle : 'hidden'
    });

    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', createWindow);

/**
 * Quit when all windows are closed.
*/ 
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

/**
 * Helper function to get the real screen size 
 * This function will automatically detect if the main window has not yet to be defined
 * @returns {Array} List of numbers that correspond to width,height respectively
 */
function getRealScreen(): [number, number] {
    // If the main window hasn't been created, determine based on the screen size
    if (mainWindow == undefined) {
        // Set the height weight the monitor dimensions
        const screenElectron = electron.screen;
        const primaryDisplay = screenElectron.getPrimaryDisplay()
        const { width, height } = primaryDisplay.workAreaSize

        // Don't return full w/h since it causes some resizing issues
        return [width - 250 , height - 250]
    } else {
        // Else just return the mainwindows size
        return mainWindow.getSize()
    }
   
}