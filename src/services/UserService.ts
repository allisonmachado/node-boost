import { IUserRepository } from '../data/repositories/IUserRepository';
import { IUserService } from './IUserService';
import { BaseService } from './BaseService';
import { ILogger } from '../lib/ILogger';

import * as bcrypt from 'bcryptjs';

import util from 'util';

import { first } from 'lodash';
import { User } from '../data/entities/User';

export class UserService extends BaseService implements IUserService {
    private genSalt: (rounds: number) => Promise<string>;

    private hash: (s: string, salt: number | string) => Promise<string>;

    constructor(private userRepository: IUserRepository, private logger: ILogger) {
        super();
        this.userRepository = userRepository;
        this.genSalt = util.promisify(bcrypt.genSalt);
        this.hash = util.promisify(bcrypt.hash);
        this.logger.debug('initialized');
    }

    public async create(user: Omit<User, 'id'>): Promise<number> {
        const hashedPassword = await this.hashPassword(user.password);
        return this.userRepository.create({
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: hashedPassword
        });
    }

    public async list(): Promise<Omit<User, 'password'>[]> {
        const users = await this.userRepository.findTop10();
        return this.omitPassword(users);
    }

    public async findById(id: number): Promise<Omit<User, 'password'>> {
        const users = await this.userRepository.findById(id);
        if (!users) {
            return null;
        }
        return first(this.omitPassword([users]));
    }

    public async update(user: Partial<Omit<User, 'email'>>): Promise<number> {
        const hashedPassword = user.password ? await this.hashPassword(user.password) : null;
        return this.userRepository.update({
            id: user.id,
            name: user.name,
            surname: user.surname,
            password: hashedPassword
        });
    }

    public async delete(id: number, requesterId: number): Promise<number> {
        if (id === requesterId) { throw new Error('Action forbidden'); }
        return this.userRepository.delete(id);
    }

    private omitPassword(users: User[]): Omit<User, 'password'>[] {
        return users.map(u => ({
            id: u.id,
            name: u.name,
            surname: u.surname,
            email: u.email,
        }));
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await this.genSalt(10);
        return this.hash(password, salt);
    }
}
