export interface LoginRequest {
    email: string;
    password: string; 
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    role?: string; 
}

export interface JwtResponse {
    token: string;
}