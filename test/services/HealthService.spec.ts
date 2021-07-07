/* eslint-disable @typescript-eslint/ban-ts-comment */
import { HealthStatus } from '../../src/services/HealthService';
import { BaseHealthService } from '../../src/services/HealthService';

import { expect } from 'chai';
import { BaseLogger } from '../../src/lib/Logger';

describe('Health Service', () => {
    const logger = new BaseLogger('Health Service Spec');

    it('should return simple report if there are no dependencies', async () => {
        const healthService = new BaseHealthService([], logger);
        const report = await healthService.getStatus();

        expect(report.status).to.equal(HealthStatus.UP);
        expect(report.dependencies).to.be.an('Array').that.is.empty;
    });

    it('should return up if all dependencies are active', async () => {
        const reporter = { async isActive() { return true; } };
        const depOne = { label: 'database', reporter };
        const depTwo = { label: 'microservice', reporter };

        const healthService = new BaseHealthService([depOne, depTwo], logger);
        const report = await healthService.getStatus();

        expect(report.status).to.equal(HealthStatus.UP);

        const [depOneReport, depTwoReport] = report.dependencies;
        expect(depOneReport.name).to.equal('database');
        expect(depOneReport.status).to.equal(HealthStatus.UP);
        expect(depTwoReport.name).to.equal('microservice');
        expect(depTwoReport.status).to.equal(HealthStatus.UP);
    });

    it('should return down if at least one dependency is down', async () => {
        const activeReporter = { async isActive() { return true; } };
        const downReporter = { async isActive() { return false; } };
        const depOne = { label: 'database', reporter: activeReporter };
        const depTwo = { label: 'microservice', reporter: activeReporter };
        const depThree = { label: 'id-provider', reporter: downReporter };

        const healthService = new BaseHealthService([depOne, depTwo, depThree], logger);
        const report = await healthService.getStatus();

        expect(report.status).to.equal(HealthStatus.DOWN);

        const [depOneReport, depTwoReport, depThreeReporter] = report.dependencies;
        expect(depOneReport.name).to.equal('database');
        expect(depOneReport.status).to.equal(HealthStatus.UP);
        expect(depTwoReport.name).to.equal('microservice');
        expect(depTwoReport.status).to.equal(HealthStatus.UP);
        expect(depThreeReporter.name).to.equal('id-provider');
        expect(depThreeReporter.status).to.equal(HealthStatus.DOWN);
    });
});
