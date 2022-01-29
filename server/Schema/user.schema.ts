/**
 * This is our user object for our application
 */
export interface User {
    'domain': string, 
    'jira_bookmarks': JiraBookmarks[],
    'jira_tickets': JiraTickets[],
    'activeTabs': Tab[],
    'activeTabIndex': number,
    'settings': {
        'githubApiKey': string
    }
}

/**
 * Object to represent Jira bookmarks
 */
export interface JiraBookmarks {
    'url': string
}

/**
 * Object to represent Jira tickets
 */
export interface JiraTickets {
    'url': string
}

/**
 * Object to represent web tabs
 */
export interface Tab {
    'url': string
}