import express from 'express';

import { CatchUnexpected } from '../lib/Decorators';
import { BaseController } from './BaseController';
import { IHealthService } from '../services/IHealthService';
import { ILogger } from '../lib/ILogger';

@CatchUnexpected(500)
export class HealthController extends BaseController {

    constructor(private healthService: IHealthService, private logger: ILogger) {
        super();
        this.logger.debug('initialized');
    }

    public async getReport(req: express.Request, res: express.Response): Promise<void> {
        const report = await this.healthService.getStatus();
        res.send(report);
    }
}
