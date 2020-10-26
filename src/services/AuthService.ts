import { ILogger } from "../lib/ILogger";
import { CheckTypes } from "../lib/CheckTypes";
import { UserEntity } from "../data/entities/user/UserEntity";
import { BaseService } from "./BaseService";
import { ISimpleCache } from "../lib/ISimpleCache";
import { IUserRepository } from "../data/repositories/IUserRepository";
import { SharedFunctions } from "../lib/SharedFunctions";
import { IAuthService, UserJwtPayload } from "./IAuthService";

import jwt from "jsonwebtoken";

export class AuthService extends BaseService implements IAuthService {

    constructor(
        private secret: string,
        private userRepository: IUserRepository,
        private cache: ISimpleCache<UserEntity>,
        private logger: ILogger,
    ) {
        super();
        this.logger.debug(`initialized`);
    }

    public async validateCredentials(email: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!CheckTypes.isNull(user)) {
            if (await SharedFunctions.compareHashedPassword(password, user.getPassword())) {
                this.cache.save(email, user);
                return true;
            }
            return false;
        }
        return false;
    }

    public async validateAccessToken(accessToken: string): Promise<UserJwtPayload> {
        const data = await this.verify(accessToken);
        if (
            CheckTypes.isTypeString(data.name) &&
            CheckTypes.isTypeString(data.surname) &&
            CheckTypes.isTypeString(data.email)
        ) {
            return data;
        }
        throw new Error(`Invalid token Format`);
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
