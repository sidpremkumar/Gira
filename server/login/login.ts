import { LoginRequest, LoginResponse } from "./login.messages"
import { formatDomainName, getEmptyUser, SetJsonResponse } from "../utils"
import { AddUserData, GetUser } from '../database'
import { User } from "../Schema/user.schema"

/**
 * Helper function to handle our login endpoint
 * @param req Http request from express
 * @param res Http response from express 
 */
export async function handleLogin(req: any, res: any): Promise<void> {
    // Get the body of the request
    const loginRequest: LoginRequest = req.body

    let toReturn: LoginResponse = {
        valid: false,
        errorMessage: '',
        user: null
    }

    // Validate the domain
    const domainErrMsg: string = formatDomainName(loginRequest.domain);
    if (domainErrMsg !== null || loginRequest.domain === '') {
        toReturn.errorMessage = domainErrMsg;
        await SetJsonResponse(res, toReturn, 400);
        return;
    }

    // See if the user exist
    const existingUserMaybe: User = await GetUser(loginRequest.domain)

    // If the user already exists, just return
    if (existingUserMaybe !== null) {
        const errorMessage: string = `User already exists with domain: ${loginRequest.domain}`
        console.log(errorMessage);
        toReturn.errorMessage = errorMessage;
        await SetJsonResponse(res, toReturn, 400);
        return;
    }

    // Else create a user object 
    const newUser: User = getEmptyUser(loginRequest.domain);
    await AddUserData(newUser)
    toReturn.user = newUser;

    toReturn.valid = true;
    await SetJsonResponse(res, toReturn, 200);
}