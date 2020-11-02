import { ILogger } from "../lib/ILogger";
import { UserEntity } from "../data/entities/user/UserEntity";
import { BaseService } from "./BaseService";
import { ISimpleCache } from "../lib/ISimpleCache";
import { IUserRepository } from "../data/repositories/IUserRepository";
import { IAuthService, IUserJwtPayload } from "./IAuthService";

import * as bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import check from "check-types";
import validator from "validator";

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
        if (user) {
            if (await this.compareHashedPassword(password, user.getPassword())) {
                this.cache.save(email, user);
                return true;
            }
            return false;
        }
        return false;
    }

    public async signTemporaryToken(email: string): Promise<string> {
        let user = this.cache.search(email);
        if (!user) {
            user = await this.userRepository.findByEmail(email);
        }
        return this.sign({
            name: user.getName(),
            surname: user.getSurname(),
            email: user.getEmail(),
        }, "10h");
    }

    public async validateAccessToken(payload: string): Promise<IUserJwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(payload, this.secret, (err: Error | null, decoded: IUserJwtPayload | undefined) => {
                if (!!err) {
                    reject(err);
                } else {
                    if (
                        check.string(decoded.name) &&
                        check.string(decoded.surname) &&
                        check.string(decoded.email) &&
                        validator.isEmail(decoded.email)
                    ) {
                        resolve(decoded);
                    }
                    reject(new Error(`Invalid decoded jwt payload: ${JSON.stringify(decoded)}`))
                }
            });
        });
    }

    private async sign(payload: IUserJwtPayload, expiresIn: string | number): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, this.secret, { expiresIn: expiresIn }, (err: Error | null, token: string | undefined) => {
                if (!!err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    private async compareHashedPassword(password: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    }
}
