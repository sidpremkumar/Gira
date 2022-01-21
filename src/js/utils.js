const electron = require('electron');

function getRealScreen() {
    // Set the height weight the monitor dimensions
    const screenElectron = electron.screen;
    const primaryDisplay = screenElectron.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize

    // Don't return full w/h since it causes some resizing issues
    return [width - 250 , height - 250]
}

function getEmptyUser(domainName) {
    // Helper function get a empty (new) user
    return {
        'domain': domainName, 
        'bookmarks': [],
        'tickets': []
    }
}

function formatDomainName(domainName) {
    // Helper function to always ensure we have a standard domain name
    try {
        const url = new URL(domainName);

        // Always ensure that .atlassian.net is in the host
        if (!url.host.includes('.atlassian.net')) {
            console.log('Domain does not have .atlassian.net')
            return null
        }

        // Always ensure we are using https
        if (url.protocol != 'https:') {
            console.log('Domain does not have https protocol')
            return null
        }

        // Always we make sure we are at the base path
        if (url.pathname != '/') {
            console.log('Domain not as base path')
            return null
        }

        return url.toString()
    } catch (error) {
        console.log(error)
        return null
    }
}


module.exports = { getRealScreen, getEmptyUser, formatDomainName }