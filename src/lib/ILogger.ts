export interface ILogger {
    error(msg: string): void;
    info(msg: string): void;
    debug(msg: string): void;
}