import { ILogger } from '../../lib/ILogger';
import { Connection } from '../connection/mysql/Connection';
import { UserEntity } from '../entities/UserEntity';
import { IUserRepository } from './IUserRepository';

import validator from 'validator';
import lodash from 'lodash';
import check from 'check-types';
import Knex from 'knex';

export class UserRepository implements IUserRepository {
    private knex: Knex;
    constructor(private connection: Connection, protected logger: ILogger) {
        this.knex = this.connection.getQueryBuilder();
        this.logger.debug('initialized');
    }

    public async create(name: string, surname: string, email: string, password: string): Promise<number> {
        const [ id ] = await this.knex('user').insert({ name, surname, email, password });
        return id;
    }

    public async findById(id: number): Promise<UserEntity> {
        const [ user ] = await this.knex('user').where('id', id);
        if (!user || check.emptyArray(user)) {
            return null;
        }
        return this.mapRecordToUser(user);
    }

    public async findByEmail(email: string): Promise<UserEntity> {
        const [ user ] = await this.knex('user').where('email', email);
        if (!user || check.emptyArray(user)) {
            return null;
        }
        return this.mapRecordToUser(user);
    }

    public async findTop10(): Promise<UserEntity[]> {
        const users = await this.knex('user').limit(10);
        return users.map(this.mapRecordToUser.bind(this));
    }

    public async update(
        id: number, name = '', surname = '', password = '',
    ): Promise<number> {
        if (!name && !surname && !password) {
            return 0;
        }
        if (!id) {
            throw new Error('Id is mandatory parameter for updating user record');
        }
        const updateValues = lodash.pickBy({ name, surname, password });
        return await this.knex('user').where('id', id).update(updateValues);
    }

    public async delete(id: number): Promise<number> {
        return await this.knex('user').where('id', id).del();
    }

    private mapRecordToUser(user: unknown): UserEntity {
        if (!this.isUserRecord(user)) throw new Error(`Cannot map unknown value to user type: ${JSON.stringify(user)}`);
        return new UserEntity(user.id, user.name, user.surname, user.email, user.password);
    }

    private isUserRecord(obj: unknown): obj is IUserRecord {
        try {
            return (
                check.number(obj['id']) &&
                check.string(obj['name']) &&
                check.string(obj['surname']) &&
                check.string(obj['email']) &&
                check.string(obj['password']) &&
                validator.isEmail(obj['email'])
            );
        } catch (error) {
            return false;
        }
    }
}

interface IUserRecord {
    id: number,
    name: string,
    surname: string,
    email: string,
    password: string,
}
