const electron = require('electron');

function getRealScreen() {
    // Set the height weight the monitor dimensions
    const screenElectron = electron.screen;
    const primaryDisplay = screenElectron.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    const realWidth = width - 500;
    const realHeight = height - 500; 
    return [realWidth, realHeight]
}


module.exports = { getRealScreen }