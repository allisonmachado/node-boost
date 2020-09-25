import mysql from "mysql";

import { Environment } from "../../Environment";
import { Logger } from "../../Logger";

export class Connection {
    private readonly logger = new Logger(Connection.name);
    private pool: mysql.Pool;

    constructor(
        host: string,
        user: string,
        password: string,
        database: string,
        connectionLimit: number,
    ) {
        this.pool = mysql.createPool({
            connectionLimit,
            host,
            user,
            password,
            database,
        });
        if (Environment.isLocal()) {
            this.logger.debug(`initialized - [${host}][${user}][${password}][${database}]`);
        } else {
            this.logger.debug(`initialized`);
        }
    }

    public getPool(): mysql.Pool {
        return this.pool;
    }
}
