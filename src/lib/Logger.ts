import winston from 'winston';

import { Environment } from './Environment';

export interface Logger {
  error(msg: string, ...meta: unknown[]): void;
  info(msg: string, ...meta: unknown[]): void;
  debug(msg: string, ...meta: unknown[]): void;
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

  public error(msg: string, ...meta: unknown[]): void {
    this.logger.error(`[${this.prefix}]: ${msg}`, ...meta);
  }

  public info(msg: string, ...meta: unknown[]): void {
    this.logger.info(`[${this.prefix}]: ${msg}`, ...meta);
  }

  public debug(msg: string, ...meta: unknown[]): void {
    this.logger.debug(`[${this.prefix}]: ${msg}`, ...meta);
  }
}
