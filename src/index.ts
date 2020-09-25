/* Load environment configuration */
import dotenv from "dotenv";
dotenv.config();

/* Import express for web interface */
import express from "express";

/* Import application definitions */
import { Environment as Env } from "./Environment";
import { UserController } from "./controllers/User";
import { UserRepository } from "./data-source/repositories/UserRepository";
import { UserService } from "./business/UserService";
import { Connection } from "./data-source/mysql/Connection";
import { Logger } from "./Logger";

const app = express();

/* init data access layer: */
const mysqlConnection = new Connection(
    Env.getMysqlHost(),
    Env.getMysqlUser(),
    Env.getMysqlPassword(),
    Env.getMysqlSchema(),
    Env.getMysqlConnectionPoolLimit(),
)
const userRepository = new UserRepository(mysqlConnection);

/* init business logic definition: */
const userService = new UserService(userRepository);

/* init application api: */
new UserController(app, userService);

/* listen */
app.listen(Env.getPort(), () => {
    const logger = new Logger("index");
    logger.info(`App listening at ${Env.getPort()}`);
    logger.info(`App running in ${Env.getLocation()} environment`);
});
