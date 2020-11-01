import { ILogger } from "./ILogger";

export class EmptyLogger implements ILogger {
    public error(msg: string): void {/** */}
    public info(msg: string): void {/** */}
    public debug(msg: string): void {/** */}
}
