import Knex from 'knex';

export interface ISQLConnection {
    getQueryBuilder(): Knex;
}
