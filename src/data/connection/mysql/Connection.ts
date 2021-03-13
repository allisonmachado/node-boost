import Knex from "knex";
import knex from "knex";
import envConnection from "../../../knexfile";

import { ILogger } from "../../../lib/ILogger";
import { IHealthReporter } from "../../../services/IHealthReporter";

export class Connection implements IHealthReporter {
    private queryBuilder: Knex;
    private logger: ILogger;

    constructor(logger: ILogger) {
        this.queryBuilder = knex(envConnection);
        this.logger = logger;
        this.logger.debug(`initialized`);
    }

    public getQueryBuilder(): Knex {
        return this.queryBuilder;
    }

    public async isActive(): Promise<boolean> {
        try {
            const [[{ version }]] = await this.queryBuilder.raw("SELECT version() as version");
            return version.startsWith("8");
        } catch (error) {
            this.logger.error(`not active: ${error}`);
            return false;
        }
    }
}
