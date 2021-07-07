import { User } from '../entities/User';
import { Logger } from '../../lib/Logger';
import { SQLConnection } from '../connection/SQLConnection';

import lodash from 'lodash';
import Knex from 'knex';
import Joi from 'joi';

export interface UserRepository {
    create(user: Omit<User, 'id'>): Promise<number>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findTop10(): Promise<User[]>;
    update(user: Omit<User, 'email'>): Promise<number>;
    delete(id: number): Promise<number>;
}


export class BaseUserRepository implements UserRepository {
    private knex: Knex;
    constructor(private connection: SQLConnection, protected logger: Logger) {
        this.knex = this.connection.getQueryBuilder();
        this.logger.debug('initialized');
    }

    public async create(user: Omit<User, 'id'>): Promise<number> {
        const [id] = await this.knex('user').insert({
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: user.password
        });
        return id;
    }

    public async findById(id: number): Promise<User> {
        const [user] = await this.knex('user').where('id', id);
        if (!user) {
            return null;
        }
        return this.mapRecordToUser(user);
    }

    public async findByEmail(email: string): Promise<User> {
        const [user] = await this.knex('user').where('email', email);
        if (!user) {
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
        return { ...user }; // for this simple example the User and UserRecord are equal
    }

    private isUserRecord(obj: unknown): obj is UserRecord {
        const validation = Joi.object({
            id: Joi.number().integer().required(),
            name: Joi.string().required(),
            surname: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }).validate(obj);

        return !validation.error;
    }
}

interface UserRecord {
    id: number,
    name: string,
    surname: string,
    email: string,
    password: string,
}
