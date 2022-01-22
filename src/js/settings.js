const { ipcRenderer } = require('electron')

// Listen for init from main to populate the form
ipcRenderer.on('settings-init', (event, args) => {
    // Grab the value of the api key
    var apiKeyObj = document.getElementById("fkey");
    apiKeyObj.value = args['apiKey']
})

// Add a listener on the form
var formObj = document.getElementsByClassName("settingsForm")[0]
formObj.addEventListener("submit", event => {
    // Grab the value of the api key
    var apiKeyObj = document.getElementById("fkey");

    // Gather the values from the settings
    let apiKey = apiKeyObj.value;

    // Let the main function know the updated values
    const settingsInfo = {
        'apiKey': apiKey
    }
    ipcRenderer.send('settings-update', settingsInfo)

    // TODO: Add some sort of update dialog
    event.preventDefault();
});