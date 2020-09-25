import { Environment } from "./Environment";

import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { Logger } from "./Logger";

const app = express();
const port = 3000;
const logger = new Logger("Main");

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    logger.info(`App listening at ${port}`);
    logger.info(`App running in ${Environment.getLocation()} environment`);

    logger.error(`error log`);
    logger.debug(`debug log`);
});
