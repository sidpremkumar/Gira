import { User } from "./Schema/user.schema";

export async function SetJsonResponse(res: any, toReturn: any, responseCode: number) {
    res.setHeader('Content-Type', 'application/json');
    res.status(responseCode);
    res.end(JSON.stringify(toReturn));
}

export function getEmptyUser(domainName: string): User {
    // Helper function get a empty (new) user
    return {
        'domain': domainName, 
        'jira_bookmarks': [],
        'jira_tickets': [],
        'activeTabs': [],
        'activeTabIndex': -1,
        'settings': {
            'githubApiKey': null
        }
    }
}