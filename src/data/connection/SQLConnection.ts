import Knex from 'knex';
import knex from 'knex';
import envConnection from '../../knexfile';

import { Logger } from '../../lib/Logger';
import { HealthReporter } from '../../lib/HealthReporter';

export interface SQLConnection {
    getQueryBuilder(): Knex;
}

export class MySQLConnection implements SQLConnection, HealthReporter {
    private queryBuilder: Knex;
    private logger: Logger;

    constructor(logger: Logger) {
        this.queryBuilder = knex(envConnection);
        this.logger = logger;
        this.logger.debug('initialized');
    }

    public getQueryBuilder(): Knex {
        return this.queryBuilder;
    }

    public async isActive(): Promise<boolean> {
        try {
            const [[{ version }]] = await this.queryBuilder.raw('SELECT version() as version');
            return version.startsWith('5');
        } catch (error) {
            this.logger.error(`not active: ${error}`);
            return false;
        }
    }
}
