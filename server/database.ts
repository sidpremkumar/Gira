// Built in
const path = require('path')

// 3rd Party
const Datastore = require('nedb')

// Local
import { User } from './Schema/user.schema'

const DATABASE_FILE_NAME: string = 'jira_client_database'

// Load in our database
var root = __dirname;
const db = new Datastore({ filename:  path.join(root, DATABASE_FILE_NAME), autoload: true });


/**
 * Helper function to add a new user to our database
 * @param {User} newUserData New user data we are trying to create
*/
export async function AddUserData(newUserData: User): Promise<void> {
    db.find({domain: newUserData.domain}, function (err: any, existingData: []) {
        // This should not happen
        if (existingData.length != 0) {
            console.log('User data already exists!')
            return;
        }

        db.insert(newUserData, function (err: any, newData: User) {
            console.log('Added user data to the database!')
        })
    })
}

/** 
 * Helper function to update a user in our database
 * @param {User} newUserData New user data we are trying to update 
*/
export async function UpdateUser(newUserData: User): Promise<void> {
    const updateUserPromise = new Promise(async (resolve, reject) => {
        db.update({ domain: newUserData.domain }, newUserData, {}, function (err: any, numReplaced: []) {
            if (numReplaced.length == 0) {
                // This should not happen
                console.log(`No user found for given domain name: ${newUserData.domain}`)
                reject(null)
            } else {
                console.log('updated record')
                resolve(null)
            }

        });
    });
    await updateUserPromise;
}

/**
 * Helper function to Get a users info from their domain name for their jira account
 * @param {string} domainName Domain name to lookup
 * @return {User} User data we are trying to lookup
*/
export async function GetUser(domainName: string): Promise<User> {
    const findUserPromise = new Promise<User>(async (resolve, reject) => {
        db.find({domain: domainName}, function (err: any, existingData: User[]) {
            // This should not happen
            if (existingData.length == 0) {
                console.log(`No user found for given domain name: ${domainName}`)
                resolve(null)
            }

            if (existingData.length > 1) {
                console.log(`Too many users found for given domain name: ${domainName}`)
                resolve(null)
            }

            resolve(existingData[0])
        })
    })
    try {
        return await findUserPromise;
    } catch (e: any) {
        return null
    }
}

/**
 * Helper function to try to find an existing user in our database
 * There should only be one user at a given time
 * @return {User} User data we are trying to lookup
*/
export async function FindExistingUser(): Promise<User> {
    const findExistingUserPromise = new Promise<User>(async (resolve, reject) => {
        db.find({}, function (err: any, existingData: User[]) {
            if (err != null) {
                console.log('Error getting existing data')
                resolve(null)
            }
            // This should not happen
            if (existingData.length == 0) {
                console.log('No user found for given domain name')
                resolve(null)
            }

            if (existingData.length > 1) {
                console.log('too many users found for given domain name')
                resolve(null)
            }

            resolve(existingData[0])
        })
    })

    try {
        return await findExistingUserPromise;
    } catch (e: any) {
        return null
    }
}

// async function DeleteUser(domainName) {
//     const deleteUserPromise = new Promise(async (resolve, reject) => {
//         db.remove({ domain: domainName }, function (err, numRemoved) {
//             if (numRemoved == 0) {
//                 console.log('unable to delete user')
//                 resolve()
//             } else {
//                 console.log('delete user')
//                 reject()
//             }
//         })
//     });

//     await deleteUserPromise;
// }
