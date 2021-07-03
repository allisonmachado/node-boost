import Knex from 'knex';

import { MySQLConnection } from '../data/connection/mysql/Connection';
import { UserRepository } from '../data/repositories/UserRepository';
import { UserService } from '../services/UserService';
import { Logger } from '../lib/Logger';

const EMAIL = 'node-boost@email.com';

export async function up(): Promise<void> {
    const mysqlConnection = new MySQLConnection(new Logger(MySQLConnection.name));
    const userRepository = new UserRepository(mysqlConnection, new Logger(UserRepository.name));
    const userService = new UserService(userRepository, new Logger(UserService.name));
    const password = process.env.INIT_PASSWORD;
    await userService.create({ name: 'Node', surname: 'Boost', email: EMAIL, password });
}

export async function down(knex: Knex): Promise<void> {
    await knex('user')
        .where('email', EMAIL)
        .del();
}
