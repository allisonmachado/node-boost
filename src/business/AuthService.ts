import { Logger } from "../Logger";
import { CheckTypes } from "../CheckTypes";

import jwt from "jsonwebtoken";

export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private secret: string) {
        if (!CheckTypes.hasContent(secret)) {
            throw new Error(`[${AuthService.name}]: jwt secret to sign or validate token is required`);
        }
    }

    public async validateCredentials(email: string, password: string): Promise<boolean> {
        return true;
    }

    public async signTemporaryToken(email: string): Promise<string> {
        return this.sign({
            name: "user",
            email: "email@email.com",
            password: "1234567",
        });
    }

    private async sign(payload: UserJwtPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, this.secret, function (err: Error | null, token: string | undefined) {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }
}

export interface UserJwtPayload {
    name: string;
    email: string;
    password: string;
}