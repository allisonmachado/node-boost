import { Logger } from '../lib/Logger';
import { BasicCache } from '../lib/BasicCache';
import { User, UserRepository } from '../data/repositories/UserRepository';
import { GetPublicKeyOrSecret, Secret, SignOptions } from 'jsonwebtoken';

import * as bcrypt from 'bcryptjs';

import util from 'util';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

export interface AuthService {
  validateCredentials(email: string, password: string): Promise<boolean>;
  validateAccessToken(accessToken: string): Promise<UserJwtPayload>;
  signAccessToken(email: string): Promise<string>;
}

export interface UserJwtPayload {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export class BaseAuthService implements AuthService {

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
    private userRepository: UserRepository,
    private cache: BasicCache<User>,
    private logger: Logger,
  ) {
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

  public async validateAccessToken(payload: string): Promise<UserJwtPayload> {
    const decoded = await this.verify(payload, this.secret);
    if (this.isUserJwtToken(decoded)) {
      return decoded;
    }
    throw new Error(`Invalid decoded jwt payload: ${JSON.stringify(decoded)}`);
  }

  private isUserJwtToken(obj: unknown): obj is UserJwtPayload {
    const validation = Joi.object({
      id: Joi.number().integer().required(),
      name: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string().email().required(),
    }).options({ allowUnknown: true }).validate(obj);

    return !validation.error;
  }
}
