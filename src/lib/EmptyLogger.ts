import { ILogger } from "./ILogger";

export class EmptyLogger implements ILogger {
    error(msg: string): void {
    }
    info(msg: string): void {
    }
    debug(msg: string): void {
    }
}
