import { ILogger } from '../lib/ILogger';
import { UserEntity } from '../data/entities/UserEntity';
import { BaseService } from './BaseService';
import { ISimpleCache } from '../lib/ISimpleCache';
import { IUserRepository } from '../data/repositories/IUserRepository';
import { IAuthService, IUserJwtPayload } from './IAuthService';
import { GetPublicKeyOrSecret, Secret, SignOptions } from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';

import util from 'util';
import jwt from 'jsonwebtoken';
import check from 'check-types';
import validator from 'validator';

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
        private cache: ISimpleCache<UserEntity>,
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
            id: user.getId(),
            name: user.getName(),
            surname: user.getSurname(),
            email: user.getEmail(),
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
        try {
            return (
                check.number(obj['id']) &&
                check.string(obj['name']) &&
                check.string(obj['surname']) &&
                check.string(obj['email']) &&
                validator.isEmail(obj['email'])
            );
        } catch (error) {
            return false;
        }
    }
}
