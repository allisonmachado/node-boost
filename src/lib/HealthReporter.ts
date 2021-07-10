export interface HealthReporter {
  isActive(): Promise<boolean>;
}
