import { Environment } from "./Environment";

import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { Logger } from "./Logger";
import { UserController } from "./controllers/User";
import { UserRepository } from "./data-source/repositories/UserRepository";
import { UserService } from "./business/UserService";

const app = express();
const port = Environment.getPort();
const logger = new Logger("Main");

app.listen(port, () => {
    logger.info(`App listening at ${port}`);
    logger.info(`App running in ${Environment.getLocation()} environment`);
});


/* data access layer: */
const userRepository = new UserRepository();

/* business logic definition: */
const userService = new UserService(userRepository);

/* application api: */
new UserController(app, userService);
