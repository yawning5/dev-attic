export interface LoginInput {
    id: string;
    password: string;
}

export interface JwtResponse {
    accessToken: string;
    tokneType: string;
}