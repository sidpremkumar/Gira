// Build in
const path = require('path')
const url = require('url')

// 3rd Party
const { app, BrowserWindow, BrowserView } = require('electron')
const { ipcMain, remote } = require('electron')
const electron = require('electron');
const electronReload = require('electron-reload');
const contextMenu = require('electron-context-menu');
const shell = require('electron').shell;
var Datastore = require('nedb')

// Local
const utils = require('./src/js/utils')
const database = require('./src/js/database')

// Disables warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// This is our key in our db, so for adding bookmarks etc keep this around
let jiraDomain;

// These our all the windows
let mainWindow;
let jiraView; 
let sideBarView; 
let loginView;

async function createIndex () {
    const [ width, height ] = utils.getRealScreen()

    // Create the main browser window.
    mainWindow = new BrowserWindow({
        width: width, 
        height: height,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            spellcheck: true,
            webviewTag: true
        }})

    // Check if we have any user that's logged in
    existingUser = await database.FindExistingUser() 
    if (existingUser !== null) {
        // Set the jiraDomain
        jiraDomain = existingUser['domain'];

        await setMainView(existingUser)
    } else {
        await setLoginView()
    }
}

// receive message from login.html 
ipcMain.on('creds', async (event, domainName) => {
    // First format the domain name
    domainName = utils.formatDomainName(domainName)

    if (domainName == null) {
        // TODO: Popup
        console.log('Could not validate domain name');
        return;
    }

    // Save this data to our database only if the user does not exists
    var existingUser = await database.GetUser(domainName)
    if (existingUser === null) {
        // Create a new user object
        existingUser = utils.getEmptyUser(domainName)
        database.AddUserData(existingUser)
    }
   
    jiraDomain = domainName;

    await setMainView(existingUser)
});

// receive message from sidebar.html 
ipcMain.on('sidebar-exit', async (event, arg) => {
    // Clear all views
    // TODO: Clear cookies so they have to re-login
    mainWindow.setBrowserView(null)
    jiraView.webContents.destroy();
    sideBarView.webContents.destroy();

    // Clear our the db info as well
    database.DeleteUser(jiraDomain)
    jiraDomain = null

    // and load the login.html of the app.
    await setLoginView()
});
ipcMain.on('sidebar-home', (event, arg) => {
    // Let our tab group know to switch to the main tab
    const newTabInfo = {
        'domain': jiraDomain,
        'title': '/' 
    }

    jiraView.webContents.send('tabgroup-switch', newTabInfo);
});
ipcMain.on('sidebar-linkclick', (event, arg) => {
    // Let our tab group know to switch to the main tab
    const newTabInfo = {
        'domain': arg['url'],
        'title': arg['name']
    }

    jiraView.webContents.send('tabgroup-switch', newTabInfo);
});
ipcMain.on('sidebar-bookmarkdelete', async (event, arg) => {
    // Get the users info
    var userInfo = await database.GetUser(jiraDomain);
    userInfo['bookmarks'] = userInfo['bookmarks'].filter(item => {
        return JSON.stringify(item) !== JSON.stringify(arg)
    })
    database.UpdateUser(userInfo)

    // Now update the bookmarks sidebar
    sideBarView.webContents.send('sidebar-bookmarks', userInfo)
});
ipcMain.on('sidebar-ticketsdelete', async (event, arg) => {
    // Get the users info
    var userInfo = await database.GetUser(jiraDomain);
    userInfo['tickets'] = userInfo['tickets'].filter(item => {
        return JSON.stringify(item) !== JSON.stringify(arg)
    })
    database.UpdateUser(userInfo)

    // Now update the bookmarks sidebar
    sideBarView.webContents.send('sidebar-tickets', userInfo)
});

//call the creation function when app is done loading
app.whenReady().then(createIndex)

//this event is invoked when user is quitting the application
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

async function saveToBookmarks(nameToSave, urlToSave) {
    // First save this in our db
    var existingData = await database.GetUser(jiraDomain)

    // Ensure this url does not already exist
    if (existingData['bookmarks'].includes(urlToSave)) {
        console.log('bookmark already exists')
        return
    }

    // Else add and update the record
    existingData['bookmarks'].push({
        'url': urlToSave,
        'name': nameToSave
    })
    database.UpdateUser(existingData)
    
    // Then let our sidebar know about the updated state
    sideBarView.webContents.send('sidebar-bookmarks', existingData)
}

async function saveToTickets(nameToSave, urlToSave) {
    // First save this in our db
    var existingData = await database.GetUser(jiraDomain)

    // Ensure this url does not already exist
    if (existingData['tickets'].includes(urlToSave)) {
        console.log('ticket already exists')
        return
    }

    // Else add and update the record
    existingData['tickets'].push({
        'url': urlToSave,
        'name': nameToSave
    })
    database.UpdateUser(existingData)
    
    // Then let our sidebar know about the updated state
    sideBarView.webContents.send('sidebar-tickets', existingData)
}

async function updateSidebar(userInfo) {
    // Let our sidebar know of the state
    sideBarView.webContents.send('sidebar-bookmarks', userInfo)
    sideBarView.webContents.send('sidebar-bookmarks', userInfo)
    sideBarView.webContents.send('sidebar-tickets', userInfo)
}

async function setMainView(userInfo) {
    // Clear the main window
    mainWindow.setBrowserView(null)

    const [ width, height ] = utils.getRealScreen()

    // Create a window for the jira content and sidebar
    jiraView  = new BrowserView({webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        spellcheck: true,
        webviewTag: true
    }})
    sideBarView = new BrowserView({webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }})

    // Add them both to the view
    mainWindow.addBrowserView(jiraView)
    mainWindow.addBrowserView(sideBarView)

    // Set the bound of the sidebar
    sideBarView.setBounds({ x: 0, y: 0, width: 200, height: height })
    sideBarView.setAutoResize({ width: true, height: true });
    jiraView.setBounds({ x: 200, y: 0, width: width - 200, height: height })
    jiraView.setAutoResize({ width: true, height: true });

    // Load contents into these views
    jiraView.webContents.loadURL(url.format({
        pathname: path.join(__dirname, 'src/html/main.html'),
        protocol: 'file:',
        slashes: true
    }))

    sideBarView.webContents.loadURL(url.format({
        pathname: path.join(__dirname, 'src/html/sidebar.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Perform any actions needed on load
    jiraView.webContents.on('did-finish-load', () => {
        contextMenu({
            window: jiraView,
            prepend: (defaultActions, params, mainWindow) => [
                // Can add custom right click actions here
                {
                    label: 'Inspect Element',
                    click: () =>
                    {
                        jiraView.webContents.inspectElement (0, 0);
                    }
                }
            ], 
            showInspectElement: false
            },
        );

        // Also let our tabgroup know the default info
        const initInfo = {
            'domain': userInfo['domain'],
            'title': '/'
        }
        jiraView.webContents.send('tabgroup-init', initInfo);

        // And open a new tab
        openNewTab(userInfo['domain']);
    });

    // Perform any actions needed on load
    sideBarView.webContents.on('did-finish-load', () => {
        contextMenu({
            window: sideBarView,
            prepend: (defaultActions, params, mainWindow) => [
                // Can add custom right click actions here
                {
                    label: 'Inspect Element',
                    click: () =>
                    {
                        sideBarView.webContents.inspectElement (0, 0);
                    }
                }
            ], 
            showInspectElement: false
            },
        );

        // Also let our sidebar know of the bookmarks for the user
        // // Also let our tabgroup know the default info
        // const initInfo = {
        //     'domain': domainName,
        //     'title': '/'
        // }
        // jiraView.webContents.send('tabgroup-init', initInfo);

        // // And open a new tab
        // openNewTab(domainName);
    });

    // Ref: https://github.com/sindresorhus/electron-context-menu/issues/37#issuecomment-628657983
    // This is the right click event on the tabs themselves
    app.on("web-contents-created", async (e, contents) => { 
        if (contents.getType() == "webview") {
            // set context menu in webview contextMenu({ window: contents, });
            contextMenu({
                window: contents,
                prepend: (defaultActions, params, mainWindow) => [
                    // Can add custom right click actions here
                    {
                        label: 'Inspect Element',
                        click: () =>
                        {
                            jiraView.webContents.inspectElement (0, 0);
                        }
                    },
                    {
                        label: 'Open in new tab',
                        click: () =>
                        {
                            const toOpen = params['linkURL']
                            openNewTab(toOpen);
                        }
                    },
                    {
                        label: 'Save to bookmarks',
                        click: () =>
                        {
                            saveToBookmarks(params['linkText'], params['linkURL'])
                        }
                    },
                    {
                        label: 'Save to tickets',
                        click: () =>
                        {
                            saveToTickets(params['linkText'], params['linkURL'])
                        }
                    },
                    {
                        label: 'Back',
                        click: () =>
                        {
                            moveBack()
                        }
                    },
                    {
                        label: 'Forward',
                        click: () =>
                        {
                            moveForward()
                        }
                    }
                ], 
                showInspectElement: false
                },
            );
        }
    });

    // Also update the sidebar when its loaded
    sideBarView.webContents.on('did-finish-load', async () => {
        await updateSidebar(existingUser)
    });

}

function getUrlName(url) {
    // Helper function to get a url name
    return url.replace(jiraDomain, '')
}

function moveBack() {
    // Function to tell the active tab to move back 
    jiraView.webContents.send('tabgroup-back', '')
}

function moveForward() {
    // Function to tell the active tab to move forward 
    jiraView.webContents.send('tabgroup-forward', '')
}

function openNewTab(newUrl) {
    // TODO: Try catch this
    // For now the name of tabs is just the path of the url
    let title = '/'

    if (newUrl != jiraDomain) {
        title = getUrlName(newUrl)
    }

    // Helper function to send new tab info over our ipc
    const newTabInfo = {
        'domain': newUrl,
        'title': title 
    }
    jiraView.webContents.send('tabgroup-tab', newTabInfo);
}

async function setLoginView() {
    // Load the login page of our app

    const [ width, height ] = utils.getRealScreen()
    
    loginView  = new BrowserView({webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        spellcheck: true,
        webviewTag: true
    }})

    // Add the view
    mainWindow.addBrowserView(loginView)

    // Set the bound of the sidebar
    loginView.setBounds({ x: 0, y: 0, width: width, height: height })
    loginView.setAutoResize({ width: true, height: true });

    // Load contents into these views
    loginView.webContents.loadURL(url.format({
        pathname: path.join(__dirname, 'src/html/login.html'),
        protocol: 'file:',
        slashes: true
    }))
}