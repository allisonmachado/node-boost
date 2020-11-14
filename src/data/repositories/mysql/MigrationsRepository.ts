/***
 * Do not import this in the application.
 * This is supposed to be used by the migration scripts. 
 */
import dotenv from "dotenv";
dotenv.config();

import { RespositoryTemplate } from "./RepositoryTemplate";
import { Environment as Env } from "../../../lib/Environment";
import { Connection } from "./Connection";
import { EmptyLogger } from "../../../lib/EmptyLogger";

class MigrationsRepository extends RespositoryTemplate {
    constructor() {
        const logger = new EmptyLogger();
        super(new Connection(
            Env.getMysqlHost(),
            Env.getMysqlUser(),
            Env.getMysqlPassword(),
            undefined,
            Env.getMysqlConnectionPoolLimit(),
            logger,
        ), logger);
        this.logger.debug(`initialized`);
    }
}

export default new MigrationsRepository();