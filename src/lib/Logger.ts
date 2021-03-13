import winston from 'winston';

import { ILogger } from './ILogger';
import { Environment } from './Environment';

export class Logger implements ILogger {
    private static readonly level = Environment.getLogLevel();
    private logger: winston.Logger;

    constructor(private prefix: string) {
        this.logger = winston.createLogger({
            level: Logger.level,
            format: winston.format.json(),
            transports: [
                new winston.transports.Console(),
            ],
        });
    }

    public error(msg: string): void {
        this.logger.error(`[${this.prefix}]: ${msg}`);
    }

    public info(msg: string): void {
        this.logger.info(`[${this.prefix}]: ${msg}`);
    }

    public debug(msg: string): void {
        this.logger.log({
            message: `[${this.prefix}]: ${msg}`,
            level: 'debug',
        });
    }
}
