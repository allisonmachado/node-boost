import { User } from '../entities/User';
import { ILogger } from '../../lib/ILogger';
import { ISQLConnection } from '../connection/ISQLConnection';
import { IUserRepository } from './IUserRepository';

import validator from 'validator';
import lodash from 'lodash';
import check from 'check-types';
import Knex from 'knex';

export class UserRepository implements IUserRepository {
    private knex: Knex;
    constructor(private connection: ISQLConnection, protected logger: ILogger) {
        this.knex = this.connection.getQueryBuilder();
        this.logger.debug('initialized');
    }

    public async create(user: Omit<User, 'id'>): Promise<number> {
        const [ id ] = await this.knex('user').insert({
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: user.password
        });
        return id;
    }

    public async findById(id: number): Promise<User> {
        const [ user ] = await this.knex('user').where('id', id);
        if (!user || check.emptyArray(user)) {
            return null;
        }
        return this.mapRecordToUser(user);
    }

    public async findByEmail(email: string): Promise<User> {
        const [ user ] = await this.knex('user').where('email', email);
        if (!user || check.emptyArray(user)) {
            return null;
        }
        return this.mapRecordToUser(user);
    }

    public async findTop10(): Promise<User[]> {
        const users = await this.knex('user').limit(10);
        return users.map(this.mapRecordToUser.bind(this));
    }

    public async update(user: Partial<Omit<User, 'email'>>): Promise<number> {
        if (!user.name && !user.surname && !user.password) return 0;
        if (!user.id) throw new Error('Id is mandatory parameter for updating user record');

        const updateValues = lodash.pickBy(user);
        return await this.knex('user').where('id', user.id).update(updateValues);
    }

    public async delete(id: number): Promise<number> {
        return await this.knex('user').where('id', id).del();
    }

    private mapRecordToUser(user: unknown): User {
        if (!this.isUserRecord(user)) throw new Error(`Cannot map unknown value to user type: ${JSON.stringify(user)}`);
        return user; // for this simple example the User and UserRecord are equal
    }

    private isUserRecord(obj: unknown): obj is UserRecord {
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

interface UserRecord {
    id: number,
    name: string,
    surname: string,
    email: string,
    password: string,
}
