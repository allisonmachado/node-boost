import express from "express";

import { ILogger } from "../lib/ILogger";

export class GlobalMiddleware {
    constructor(private logger: ILogger) {
        this.logger.debug(`initialized`);
    }

    public requestLogger(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            const method = req.method;
            const url = req.url;
            const status = res.statusCode;
            this.logger.info(`[${(new Date()).toUTCString()}] ${method}:${url} ${status} - ${duration}ms`);
        });
        next();
    }

    public errorHandler(error: any, req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (error instanceof SyntaxError) {
            this.logger.debug(`Unexpected JSON format, ${error}`);
            res.status(400).send();
        } else {
            this.logger.error(`${error}`);
            res.status(500).send();
        }
    }
}