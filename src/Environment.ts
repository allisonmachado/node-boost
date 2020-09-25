export class Environment {
  public static getLocation(): string {
    return process.env.ENV;
  }

  public static getLogLevel(): string {
    return process.env.LOG_LEVEL;
  }
}