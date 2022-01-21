// Our listener to maximize the window on double click
let topBar = document.getElementsByClassName('top-titlebar');
topBar = topBar[0]
topBar.addEventListener('dblclick', function (e) {
    ipcRenderer.send('app-dblclick', '')
});