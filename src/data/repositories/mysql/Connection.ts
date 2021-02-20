import mysql from "mysql";

import { ILogger } from "../../../lib/ILogger";
import { IHealthReporter } from "../../../services/IHealthReporter";

export class Connection implements IHealthReporter {
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

    public isActive(): Promise<boolean> {
        const query = "SELECT version()";
        return new Promise((resolve, _reject) => {
            this.pool.getConnection((err, conn) => {
                if (err) {
                    this.logger.error(`get connection: ${err}`);
                    resolve(false);
                } else {
                    if (conn) {
                        conn.query(query, (error, _results) => {
                            conn.release();
                            if (error) {
                                this.logger.error(`query: ${error}`);
                                resolve(false);
                            }
                            resolve(true);
                        });
                    } else {
                        this.logger.error(`Not possible to stablish connection with Database Server`);
                        resolve(false);
                    }
                }
            });
        });
    }
}
