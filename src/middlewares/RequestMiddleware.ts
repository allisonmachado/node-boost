import express from "express";

import { ILogger } from "../lib/ILogger";

export class RequestMiddleware {
    constructor(private logger: ILogger) {
        this.logger.debug(`initialized`);
    }

    public log(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const start = Date.now();
        res.on("finish", () => this.logger.info(`${req.method}:${req.url} ${res.statusCode} - ${Date.now() - start}ms`));
        next();
    }

    public handleErrors(
        error: any, req: express.Request, res: express.Response, next: express.NextFunction,
    ): void {
        if (error instanceof SyntaxError) {
            this.logger.debug(`Unexpected JSON format, ${error}`);
            res.status(400).send();
        } else {
            this.logger.error(`${error}`);
            res.status(500).send();
        }
    }
}
