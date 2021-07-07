import { User } from '../data/entities/User';
import { ILogger } from '../lib/ILogger';
import { BaseService } from './BaseService';
import { ISimpleCache } from '../lib/ISimpleCache';
import { IUserRepository } from '../data/repositories/IUserRepository';
import { IAuthService, IUserJwtPayload } from './IAuthService';
import { GetPublicKeyOrSecret, Secret, SignOptions } from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';

import util from 'util';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

export class AuthService extends BaseService implements IAuthService {

    private compareHashedPassword: (
        passwd1: string,
        passwd2: string,
    ) => Promise<boolean>;

    private sign: (
        payload: string | Buffer | unknown,
        secretOrPrivateKey: Secret,
        options: SignOptions,
    ) => Promise<string | undefined>;

    private verify: (
        token: string,
        secretOrPublicKey: Secret | GetPublicKeyOrSecret,
    ) => Promise<unknown>;

    constructor(
        private secret: string,
        private userRepository: IUserRepository,
        private cache: ISimpleCache<User>,
        private logger: ILogger,
    ) {
        super();
        this.compareHashedPassword = util.promisify(bcrypt.compare);
        this.sign = util.promisify(jwt.sign);
        this.verify = util.promisify(jwt.verify);
        this.logger.debug('initialized');
    }

    public async validateCredentials(email: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (user) {
            if (await this.compareHashedPassword(password, user.password)) {
                this.cache.save(email, user);
                return true;
            }
            return false;
        }
        return false;
    }

    public async signAccessToken(email: string): Promise<string> {
        let user = this.cache.search(email);
        if (!user) {
            user = await this.userRepository.findByEmail(email);
        }
        return this.sign({
            id: user.id,
            name: user.name,
            surname: user.surname,
            email: user.email,
        }, this.secret, { expiresIn: '10h' });
    }

    public async validateAccessToken(payload: string): Promise<IUserJwtPayload> {
        const decoded = await this.verify(payload, this.secret);
        if (this.isUserJwtToken(decoded)) {
            return decoded;
        }
        throw new Error(`Invalid decoded jwt payload: ${JSON.stringify(decoded)}`);
    }

    private isUserJwtToken(obj: unknown): obj is IUserJwtPayload {
        const validation = Joi.object({
            id: Joi.number().integer().required(),
            name: Joi.string().required(),
            surname: Joi.string().required(),
            email: Joi.string().email().required(),
        }).options({ allowUnknown: true }).validate(obj);

        return !validation.error;
    }
}
