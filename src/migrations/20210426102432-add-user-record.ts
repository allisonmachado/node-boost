import Knex from 'knex';

import { MySQLConnection } from '../data/connection/SQLConnection';
import { BaseUserRepository } from '../data/repositories/UserRepository';
import { BaseUserService } from '../services/UserService';
import { BaseLogger } from '../lib/Logger';

const EMAIL = 'node-boost@email.com';

export async function up(): Promise<void> {
  const mysqlConnection = new MySQLConnection(new BaseLogger(MySQLConnection.name));
  const userRepository = new BaseUserRepository(mysqlConnection, new BaseLogger(BaseUserRepository.name));
  const userService = new BaseUserService(userRepository, new BaseLogger(BaseUserService.name));
  const password = process.env.INIT_PASSWORD;
  await userService.create({ name: 'Node', surname: 'Boost', email: EMAIL, password });
}

export async function down(knex: Knex): Promise<void> {
  await knex('user')
    .where('email', EMAIL)
    .del();
}
