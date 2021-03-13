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
        let status = HealthStatus.UP;
        const timestamp = Date.now();
        const dependencies = [];
        for (const dependency of this.dependencies) {
            const active = await dependency.reporter.isActive();
            if (!active) { status = HealthStatus.DOWN; }
            dependencies.push({
                name: dependency.label,
                status: active ? HealthStatus.UP : HealthStatus.DOWN,
            });
        }
        const report = { timestamp, status, dependencies };
        this.logger.info(this.stringifyReport(report));
        return report;
    }

    private stringifyReport(report: IHealthReport): string {
        return `[${report.status.toUpperCase()}]`
            + `${report.dependencies.map(d => `'${d.name}': ${d.status}`).join(', ')}`;
    }
}
