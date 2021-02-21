export interface IHealthService {
    getStatus(): Promise<IHealthReport>;
}

export enum HealthStatus {
    UP = "up",
    DOWN = "down",
}

export interface IHealthReport {
    timestamp: number;
    status: HealthStatus;
    dependencies: Array<{ name: string, status: HealthStatus }>;
}
