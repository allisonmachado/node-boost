export interface IAuthService {
    validateCredentials(email: string, password: string): Promise<boolean>;
    validateAccessToken(accessToken: string): Promise<IUserJwtPayload>;
    signAccessToken(email: string): Promise<string>;
}

export interface IUserJwtPayload {
    id: number;
    name: string;
    surname: string;
    email: string;
}
