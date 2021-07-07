import Knex from 'knex';

export interface SQLConnection {
    getQueryBuilder(): Knex;
}
