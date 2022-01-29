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

export interface JiraBookmarks {
    'url': string
}

export interface JiraTickets {
    'url': string
}

export interface Tab {
    'url': string
}