import { Environment } from "./Environment";

import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { Logger } from "./Logger";
import { UserController } from "./controllers/User";

const app = express();
const port = Environment.getPort();
const logger = new Logger("Main");

app.listen(port, () => {
    logger.info(`App listening at ${port}`);
    logger.info(`App running in ${Environment.getLocation()} environment`);
});

// exposed controllers:
new UserController(app);