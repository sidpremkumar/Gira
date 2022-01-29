import { LoginRequest, LoginResponse } from "./login.messages"
import { getEmptyUser, SetJsonResponse } from "../utils"
import { AddUserData, FindExistingUser, GetUser } from '../database'
import { User } from "../Schema/user.schema"

/**
 * Helper function to handle our login endpoint
 * @param req Http request from express
 * @param res Http response from express 
 */
export async function handleLogin(req: any, res: any): Promise<void> {
    // Get the body of the request
    const loginRequest: LoginRequest = req.body

    // See if the user exist
    const existingUserMaybe: User = await GetUser(loginRequest.domain)

    let toReturn: LoginResponse = {
        valid: false,
        errorMessage: ''
    }

    // If the user already exists, just return
    if (existingUserMaybe !== null) {
        const errorMessage: string = `User already exists with domain: ${loginRequest.domain}`
        console.log(errorMessage);
        toReturn.errorMessage = errorMessage;
        await SetJsonResponse(res, toReturn, 401);
        return;
    }

    // Else create a user object 
    const newUser: User = getEmptyUser(loginRequest.domain);
    await AddUserData(newUser)

    toReturn.valid = true;
    await SetJsonResponse(res, toReturn, 200);
}