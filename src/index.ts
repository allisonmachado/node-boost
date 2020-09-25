/* Load environment configuration */
import dotenv from "dotenv";
dotenv.config();

/* Import express for web interface */
import express from "express";

/* Import application definitions */
import { Logger } from "./Logger";
import { Environment } from "./Environment";
import { UserController } from "./controllers/User";
import { UserRepository } from "./data-source/repositories/UserRepository";
import { UserService } from "./business/UserService";

const app = express();

/* init data access layer: */
const userRepository = new UserRepository();

/* init business logic definition: */
const userService = new UserService(userRepository);

/* init application api: */
new UserController(app, userService);

/* listen */
app.listen(Environment.getPort(), () => {
    const logger = new Logger("index");
    logger.info(`App listening at ${Environment.getPort()}`);
    logger.info(`App running in ${Environment.getLocation()} environment`);
});
