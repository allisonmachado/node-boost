import { zip } from 'lodash';
import { ILogger } from '../lib/ILogger';
import { BaseService } from './BaseService';
import { IHealthReporter } from './IHealthReporter';
import { HealthStatus, IHealthReport, IHealthService } from './IHealthService';

export class HealthService extends BaseService implements IHealthService {

    constructor(
        private dependencies: Array<{ label: string, reporter: IHealthReporter }>,
        private logger: ILogger,
    ) {
        super();
        this.logger.debug('initialized');
    }

    public async getStatus(): Promise<IHealthReport> {
        const timestamp = Date.now();

        const statuses = await Promise.all(this.dependencies.map(d => d.reporter.isActive()));
        const labels = this.dependencies.map(d => d.label);
        const dependencyParts = zip(labels, statuses);

        const dependencies = dependencyParts.map(d => {
            const [label, status] = d;
            return {
                name: label,
                status: status ? HealthStatus.UP : HealthStatus.DOWN
            };
        });
        const status = dependencies
            .every(d => d.status === HealthStatus.UP) ? HealthStatus.UP : HealthStatus.DOWN;

        const report = { timestamp, status, dependencies };

        this.logger.info(this.stringifyReport(report));
        return report;
    }

    private stringifyReport(report: IHealthReport): string {
        return `[${report.status.toUpperCase()}]`
            + `${report.dependencies.map(d => `'${d.name}': ${d.status}`).join(', ')}`;
    }
}
