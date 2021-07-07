import express from 'express';

import { CatchUnexpected } from '../lib/Decorators';
import { BaseController } from './BaseController';
import { HealthService } from '../services/HealthService';
import { Logger } from '../lib/Logger';

@CatchUnexpected(500)
export class HealthController extends BaseController {

    constructor(private healthService: HealthService, private logger: Logger) {
        super();
        this.logger.debug('initialized');
    }

    public async getReport(_req: express.Request, res: express.Response): Promise<void> {
        const report = await this.healthService.getStatus();
        res.send(report);
    }
}
