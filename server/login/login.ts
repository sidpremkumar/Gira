import { LoginRequest, LoginResponse } from "./login.messages"
import { getEmptyUser, SetJsonResponse } from "../utils"
import { AddUserData, FindExistingUser, GetUser } from '../database'
import { User } from "../Schema/user.schema"

export async function handleLogin(req: any, res: any) {
    // Get the body of the request
    const loginRequest: LoginRequest = req.body

    // See if the user exist
    const existingUserMaybe: User = await GetUser(loginRequest.domain)

    let toReturn: LoginResponse = {
        valid: false
    }

    // If the user already exists, just return
    if (existingUserMaybe === null) {
        console.log(`User already exists with domain: ${loginRequest.domain}`)
        await SetJsonResponse(res, toReturn, 401);
        return;
    }

    // Else create a user object 
    const newUser: User = getEmptyUser();
    await AddUserData(newUser)

    console.log(existingUserMaybe)

    // const toReturn: LoginResponse = {
    //     valid: true
    // }
    await SetJsonResponse(res, toReturn, 200);
}