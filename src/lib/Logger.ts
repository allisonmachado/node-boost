import winston from 'winston';

import { Environment } from './Environment';

export interface Logger {
    error(msg: string): void;
    info(msg: string): void;
    debug(msg: string): void;
}


export class BaseLogger implements Logger {
    private static readonly level = Environment.getLogLevel();
    private logger: winston.Logger;

    constructor(private prefix: string) {
      this.logger = winston.createLogger({
        level: BaseLogger.level,
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
