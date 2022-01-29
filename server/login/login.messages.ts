export interface LoginResponse {
    valid: boolean
    errorMessage: string
}

export interface LoginRequest {
    domain: string
}