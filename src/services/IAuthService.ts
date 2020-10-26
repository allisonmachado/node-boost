export interface IAuthService {
    validateCredentials(email: string, password: string): Promise<boolean>;
    validateAccessToken(accessToken: string): Promise<UserJwtPayload>;
    signTemporaryToken(email: string): Promise<string>;
}

export interface UserJwtPayload {
    name: string;
    surname: string;
    email: string;
}