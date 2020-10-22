import { Logger } from "../lib/Logger";
import { CheckTypes } from "../lib/CheckTypes";
import { UserEntity } from "../data/entities/user/UserEntity";
import { CircularCache } from "../lib/CircularCache";
import { UserRepository } from "../data/repositories/UserRepository";

import jwt from "jsonwebtoken";

export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private secret: string,
        private userRepository: UserRepository,
        private cache: CircularCache<UserEntity>,
    ) {
        if (!CheckTypes.hasContent(secret)) {
            throw new Error(`[${AuthService.name}]: jwt secret to sign or validate token is required`);
        }
    }

    public async validateCredentials(email: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!CheckTypes.isNull(user) && user.getPassword() === password) {
            this.cache.cache(email, user);
            return true;
        }
        return false;
    }

    public async validateAccessToken(accessToken: string): Promise<UserJwtPayload> {
        try {
            const tokenValue = await this.verify(accessToken);
            return tokenValue;
        } catch (error) {
            this.logger.debug(`invalid access token [${accessToken}]`);
            return null;
        }
    }

    public async signTemporaryToken(email: string): Promise<string> {
        let user = this.cache.search(email);
        if (!CheckTypes.hasContent(user)) {
            user = await this.userRepository.findByEmail(email);
        }
        return this.sign({
            name: user.getName(),
            surname: user.getSurname(),
            email: user.getEmail(),
        });
    }

    private async verify(payload: string): Promise<UserJwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(payload, this.secret, (err: Error | null, decoded: UserJwtPayload | undefined,) => {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    private async sign(payload: UserJwtPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, this.secret, (err: Error | null, token: string | undefined) => {
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
    surname: string;
    email: string;
}