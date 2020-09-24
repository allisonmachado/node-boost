export class Environment {
    public static getLocation(): string {
        return process.env.ENV;
    }
}