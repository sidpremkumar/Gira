// Build in
const path = require('path')
const url = require('url')

// 3rd Party
const { app, BrowserWindow, BrowserView } = require('electron')
const { ipcMain } = require('electron')
const electron = require('electron');
const contextMenu = require('electron-context-menu');
var Datastore = require('nedb')

// Local
const utils = require('./services/utils')
const database = require('./services/database');
const { userInfo } = require('os');

// Disables warnings
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// This is our key in our db, so for adding bookmarks etc keep this around
let jiraDomain;

// These our all the windows
let mainWindow;
let jiraView; 
let sideBarView; 
let loginView;

// These will be a list of the urls of active tabs
// This list preserves order of tabs
let activeTabs = []

async function createIndex () {
    const [ width, height ] = getRealScreen()

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
            webviewTag: true,
            scrollBounce: true
        },
        titleBarStyle : 'hidden'
    })

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
        'title': 'Untitled' 
    }

    jiraView.webContents.send('tabgroup-switch', newTabInfo);
});
ipcMain.on('sidebar-linkclick', (event, arg) => {
    // Let our tab group know to switch to the main tab
    const newTabInfo = {
        'domain': arg['url'],
        'title': 'Untilted'
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

// To capture our double click event on the top bar
ipcMain.on('app-dblclick', async (event, arg) => {
    if (mainWindow !== undefined) {
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
    }
});

// To capture tab events
ipcMain.on('tab-added', async (event, arg) => {
    // When the user opens a new tab on the ui
    // Save this tab to the list of active tabs in memory
    // On app quit we will save this to our db to preserve the tab info
    activeTabs.push({
        'url': jiraDomain,
        'id': arg
    })
})
ipcMain.on('tab-update', async (event, arg) => {
    const url = arg['url'];
    const id = arg['id'];
    activeTabs.forEach((element, index) => {
        if (element['id'] == id) {
            activeTabs[index] = {
                'url': url,
                'id': id
            }
            return
        }
    })
})
ipcMain.on('tab-removed', async (event, arg) => {
    // Loop over active tabs, and remove when we find that tab id
    activeTabs.forEach((element, index) => {
        if (element['id'] == arg) {
            activeTabs = activeTabs.splice(index, index)
            return
        }
    })
})

//call the creation function when app is done loading
app.whenReady().then(createIndex)

//this event is invoked when user is quitting the application
app.on('window-all-closed' , async () => {
    await saveActiveTabs();

    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', async () => {
   await saveActiveTabs();
})

async function saveActiveTabs() {
    // Save the active tabs to the database
    let userInfo = await database.GetUser(jiraDomain)
    userInfo['activeTabs'] = [] 
    activeTabs.forEach(tabInfo => {
        userInfo['activeTabs'].push(tabInfo['url'])
    })
    database.UpdateUser(userInfo)
}

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
    sideBarView.webContents.send('sidebar-tickets', userInfo)
}

async function setMainView(userInfo) {
    // Clear the main window
    mainWindow.setBrowserView(null)

    // Create a window for the jira content and sidebar
    jiraView  = new BrowserView({webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        spellcheck: true,
        webviewTag: true,
        scrollBounce: true
    }})
    sideBarView = new BrowserView({webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        scrollBounce: true,
    }})

    // Add them both to the view
    mainWindow.addBrowserView(jiraView)
    mainWindow.addBrowserView(sideBarView)

    // Set the bound of the sidebar
    const [ width, height ] = getRealScreen()
    await setMainViewBounds(width, height)

    // Height set to false on purpose
    // Ref: https://github.com/electron/electron/issues/13468#issuecomment-640195477
    sideBarView.setAutoResize({ width: true, height: false });
    jiraView.setAutoResize({ width: true, height: false });

    // Adjust the bounds of views on resize of the main window
    mainWindow.on('resize', async function () {
        const [ width, height ] = mainWindow.getSize();
        await setMainViewBounds(width, height)
    });

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
            'title': 'Untitled'
        }
        jiraView.webContents.send('tabgroup-init', initInfo);

        // And open a new tab if there are no active tabs
        if (userInfo['activeTabs'].length == 0) {
            openNewTab(userInfo['domain']);
        } else {
            // Else loop over active tabs and open the
            userInfo['activeTabs'].forEach(url => {
                openNewTab(url);
            });
        }
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
                showInspectElement: false,
                showCopyImage: true,
                showSaveLinkAs: true
                },
            );
        }
    });

    // Also update the sidebar when its loaded
    sideBarView.webContents.on('did-finish-load', async () => {
        await updateSidebar(existingUser)
    });

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

    // Helper function to send new tab info over our ipc
    const newTabInfo = {
        'domain': newUrl,
        'title': 'Untitled'
    }
    jiraView.webContents.send('tabgroup-tab', newTabInfo);
}

async function setLoginView() {
    // Load the login page of our app

    const [ width, height ] = getRealScreen()
    
    loginView  = new BrowserView({webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        spellcheck: true,
        webviewTag: true
    }})

    // Add the view
    mainWindow.addBrowserView(loginView)

    // Set the bound of the login view
    loginView.setBounds({ x: 0, y: 0, width: width, height: height })
    loginView.setAutoResize({ width: true, height: true });

    // Load contents into these views
    loginView.webContents.loadURL(url.format({
        pathname: path.join(__dirname, 'src/html/login.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Perform any actions needed on load
    loginView.webContents.on('did-finish-load', () => {
        contextMenu({
            window: loginView,
            prepend: (defaultActions, params, mainWindow) => [
                // Can add custom right click actions here
                {
                    label: 'Inspect Element',
                    click: () =>
                    {
                        loginView.webContents.inspectElement (0, 0);
                    }
                }
            ], 
            showInspectElement: false
            },
        );
    });
}

async function setMainViewBounds(width, height) {
    // Helper function to set mainview bounds
    let sidebarWidth = parseInt(width * 0.2);

    // Always make sure the sidebar is between these bounds
    const minSidebarWidth = 150;
    const maxSidebarWidth = 250;
    if (sidebarWidth < minSidebarWidth) {
        sidebarWidth = minSidebarWidth;
    }
    if (sidebarWidth > maxSidebarWidth) {
        sidebarWidth = maxSidebarWidth;
    }

    sideBarView.setBounds({ x: 0, y: 0, width: sidebarWidth, height: height })
    jiraView.setBounds({ x: sidebarWidth, y: 0, width: width - sidebarWidth, height: height })
}

function getRealScreen() {
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