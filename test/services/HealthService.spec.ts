// tslint:disable: only-arrow-functions
import { ILogger } from "../../src/lib/ILogger";
import { EmptyLogger } from "../../src/lib/EmptyLogger";


import { HealthService } from "../../src/services/HealthService";
import { expect } from "chai";
import { HealthStatus } from "../../src/services/IHealthService";


describe("Health Service", () => {
    const logger: ILogger = new EmptyLogger();

    it("should return simple report if there are no dependencies", async () => {
        const healthService = new HealthService([], logger)
        const report = await healthService.getStatus();

        expect(report.status).to.equal(HealthStatus.UP);
        expect(report.dependencies).to.be.an("Array").that.is.empty;
    });

    it("should return up if all dependencies are active", async () => {
        const reporter = { async isActive() { return true } };
        const depOne = { label: 'database', reporter };
        const depTwo = { label: 'microservice', reporter };

        const healthService = new HealthService([depOne, depTwo], logger)
        const report = await healthService.getStatus();

        expect(report.status).to.equal(HealthStatus.UP);

        const [depOneReport, depTwoReport] = report.dependencies;
        expect(depOneReport.name).to.equal('database');
        expect(depOneReport.status).to.equal(HealthStatus.UP);
        expect(depTwoReport.name).to.equal('microservice');
        expect(depTwoReport.status).to.equal(HealthStatus.UP);
    });

    it("should return down if at least one dependency is down", async () => {
        const activeReporter = { async isActive() { return true } };
        const downReporter = { async isActive() { return false } };
        const depOne = { label: 'database', reporter: activeReporter };
        const depTwo = { label: 'microservice', reporter: activeReporter };
        const depThree = { label: 'id-provider', reporter: downReporter };

        const healthService = new HealthService([depOne, depTwo, depThree], logger)
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
