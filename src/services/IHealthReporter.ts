export interface IHealthReporter {
    isActive(): Promise<boolean>;
}
