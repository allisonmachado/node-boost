import mysql from "mysql";

import { ILogger } from "../../../lib/ILogger";

export class Connection {
    private pool: mysql.Pool;
    private logger: ILogger;

    constructor(
        host: string,
        user: string,
        password: string,
        database: string,
        connectionLimit: number,
        logger: ILogger,
    ) {
        this.pool = mysql.createPool({
            connectionLimit,
            host,
            user,
            password,
            database,
        });
        this.logger = logger;
        this.logger.debug(`initialized`);
    }

    public getPool(): mysql.Pool {
        return this.pool;
    }
}
