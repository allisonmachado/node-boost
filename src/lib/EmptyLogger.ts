import { ILogger } from "./ILogger";

export class EmptyLogger implements ILogger {
    public error(msg: string): void { msg; }
    public info(msg: string): void { msg; }
    public debug(msg: string): void { msg; }
}
