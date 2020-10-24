/**
 * Should expose only static pure functions.
 */
export class Environment {
  public static getLocation(): string {
    return process.env.ENV;
  }

  public static getLogLevel(): string {
    return process.env.LOG_LEVEL;
  }

  public static getPort(): number {
    return parseInt(process.env.PORT);
  }

  public static getMysqlHost(): string {
    return process.env.MYSQL_HOST;
  }

  public static getMysqlUser(): string {
    return process.env.MYSQL_USER;
  }

  public static getMysqlPassword(): string {
    return process.env.MYSQL_PASSWORD;
  }

  public static getMysqlSchema(): string {
    return process.env.MYSQL_SCHEMA;
  }

  public static getMysqlConnectionPoolLimit(): number {
    return parseInt(process.env.MYSQL_CONNECTION_POOL_LIMIT);
  }

  public static getJwtSecret(): string {
    return process.env.JWT_SECRET;
  }

  public static isProd(): boolean {
    return process.env.ENV == "prod";
  }

  public static isTest(): boolean {
    return process.env.ENV == "test";
  }

  public static isLocal(): boolean {
    return process.env.ENV == "local";
  }
}