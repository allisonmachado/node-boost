import knex from "knex";
import { ILogger } from "../../../lib/ILogger";
import { IHealthReporter } from "../../../services/IHealthReporter";

export class Connection implements IHealthReporter {
    private queryBuilder;
    private logger: ILogger;

    constructor(
        host: string,
        user: string,
        password: string,
        database: string,
        socketPath: string,
        logger: ILogger,
    ) {
        this.queryBuilder = knex({
            client: "mysql",
            connection: {
              host,
              user,
              password,
              database,
              socketPath,
            },
            acquireConnectionTimeout: 10000,
          });
        this.logger = logger;
        this.logger.debug(`initialized`);
    }

    public getQueryBuilder() {
        return this.queryBuilder;
    }

    public async isActive(): Promise<boolean> {
        try {
            const [ [ { version } ] ] = await this.queryBuilder.raw("SELECT version() as version");
            return version.startsWith("8");
        } catch (error) {
            this.logger.error(`not active: ${error}`);
            return false;
        }
    }
}
