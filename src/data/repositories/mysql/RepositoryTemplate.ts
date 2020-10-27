import mysql from "mysql";

import { Connection } from "./Connection";
import { ILogger } from "../../../lib/ILogger";

export abstract class RespositoryTemplate {

    constructor(private connection: Connection, protected logger: ILogger) {}

    public query(sql: string, parameters: any[] = null): Promise<any> {
        let preparedStatement = sql;
        this.logger.debug(`query(${preparedStatement})`);
        if (parameters) {
            preparedStatement = mysql.format(sql, parameters);
        }
        return new Promise((resolve, reject) => {
            this.connection.getPool().getConnection((err, conn) => {
                if (err) {
                    this.logger.error(`get connection: ${err}`);
                    reject(err);
                }
                conn.query(preparedStatement, (error, results) => {
                    conn.release();
                    if (error) {
                        this.logger.error(`query: ${error}`);
                        reject(error);
                    }
                    resolve(results);
                });
            });
        });
    }
}
