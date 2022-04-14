import { User } from "./Schema/user.schema";

/**
 * Helper function to set a json response for a http request
 * @param res Http response
 * @param toReturn Object to return
 * @param {number} responseCode Response code to return
 */
export async function SetJsonResponse(res: any, toReturn: any, responseCode: number) {
    res.setHeader('Content-Type', 'application/json');
    res.status(responseCode);
    res.end(JSON.stringify(toReturn));
}

/**
 * Helper function to get a empty user, for a new user creation
 * @param {string} domainName Domain name we are using for the new user
 * @returns User object with empty values
 */
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

/**
 * Helper function to format our domain name to a standard
 * @param {string} domainName Domain name we are using 
 * @returns null if everything is okay, else an error message
 */
export function formatDomainName(domainName: string): string {
    // Helper function to always ensure we have a standard domain name
    try {
        const url = new URL(domainName);

        // Always ensure that .atlassian.net is in the host
        if (!url.host.includes('.atlassian.net')) {
            return 'Domain does not have .atlassian.net'
        }

        // Always ensure we are using https
        if (url.protocol != 'https:') {
            return 'Domain does not have https protocol'
        }

        // Always we make sure we are at the base path
        if (url.pathname != '/') {
            return 'Domain not as base path'
        }

        return null
    } catch (error) {
        return 'Invalid url passed'
    }
}