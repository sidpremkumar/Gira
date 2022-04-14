// Local
import { User } from "../Schema/user.schema";

export interface LoginResponse {
    user: User
    valid: boolean
    errorMessage: string
}

export interface LoginRequest {
    domain: string
}