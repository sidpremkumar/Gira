// Local
import { FindExistingUser } from "../database";
import { LoginResponse } from "../login/login.messages";
import { SetJsonResponse } from "../utils";

/**
 * Helper function to see if we have a user already logged in
 * @param req Http request from express
 * @param res Http response from express 
 */
 export async function handleCheckLogin(req: any, res: any): Promise<void> {
    // Search for the user
    const maybeExistingUser = await FindExistingUser();

    let toReturn: LoginResponse = {
        valid: false,
        errorMessage: '',
        user: null
    }

    if (maybeExistingUser == null) {
        await SetJsonResponse(res, toReturn, 400);
    } else {
        toReturn.user = maybeExistingUser;
        toReturn.valid = true;
        await SetJsonResponse(res, toReturn, 200);
    }
 }