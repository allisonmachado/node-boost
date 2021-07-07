import { zipWith } from 'lodash';
import { Logger } from '../lib/Logger';
import { BaseService } from './BaseService';
import { HealthReporter } from './HealthReporter';

export interface HealthService {
    getStatus(): Promise<HealthReport>;
}

export enum HealthStatus {
    UP = 'up',
    DOWN = 'down',
}

export interface HealthReport {
    timestamp: number;
    status: HealthStatus;
    dependencies: Array<{ name: string, status: HealthStatus }>;
}

export class BaseHealthService extends BaseService implements HealthService {

    constructor(
        private dependencies: Array<{ label: string, reporter: HealthReporter }>,
        private logger: Logger,
    ) {
        super();
        this.logger.debug('initialized');
    }

    public async getStatus(): Promise<HealthReport> {
        const timestamp = Date.now();

        const statuses = await Promise.all(this.dependencies.map(d => d.reporter.isActive()));
        const labels = this.dependencies.map(d => d.label);

        const dependencyParts = zipWith(labels, statuses, (label, status) => ({ label, status }));
        const dependencies = dependencyParts.map(part => ({
            name: part.label,
            status: part.status ? HealthStatus.UP : HealthStatus.DOWN
        }));

        const status = dependencies
            .every(d => d.status === HealthStatus.UP) ? HealthStatus.UP : HealthStatus.DOWN;

        const report = { timestamp, status, dependencies };
        this.logger.info(this.stringifyReport(report));
        return report;
    }

    private stringifyReport(report: HealthReport): string {
        return `[${report.status.toUpperCase()}]`
            + `${report.dependencies.map(d => `'${d.name}': ${d.status}`).join(', ')}`;
    }
}
