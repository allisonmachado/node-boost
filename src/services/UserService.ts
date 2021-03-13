import { IUserService, IUserAccessibleProps } from './IUserService';
import { IUserRepository } from '../data/repositories/IUserRepository';
import { BaseService } from './BaseService';
import { UserEntity } from '../data/entities/UserEntity';
import { ILogger } from '../lib/ILogger';

import * as bcrypt from 'bcryptjs';

import util from 'util';

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

    public async create(name: string, surname: string, email: string, password: string): Promise<number> {
        const hashedPassword = await this.hashPassword(password);
        return this.userRepository.create(name, surname, email, hashedPassword);
    }

    public async list(): Promise<IUserAccessibleProps[]> {
        const users = await this.userRepository.findTop10();
        return this.visiblePropsMapper(users);
    }

    public async findById(id: number): Promise<IUserAccessibleProps> {
        const users = await this.userRepository.findById(id);
        if (!users) {
            return null;
        }
        return this.visiblePropsMapper([users])[0];
    }

    public async update(id: number, name: string, surname: string, password: string): Promise<number> {
        const hashedPassword = password ? await this.hashPassword(password) : '';
        return this.userRepository.update(id, name, surname, hashedPassword);
    }

    public async delete(id: number, requesterId: number): Promise<number> {
        if (id === requesterId) { throw new Error('Action forbidden'); }
        return this.userRepository.delete(id);
    }

    private visiblePropsMapper(users: UserEntity[]): IUserAccessibleProps[] {
        return users.map(u => ({
            id: u.getId(),
            name: u.getName(),
            surname: u.getSurname(),
            email: u.getEmail(),
        }));
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await this.genSalt(10);
        return this.hash(password, salt);
    }
}
