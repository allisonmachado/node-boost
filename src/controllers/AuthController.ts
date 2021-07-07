import express from 'express';

import { Logger } from '../lib/Logger';
import { AuthService } from '../services/AuthService';
import { BaseController } from './BaseController';
import { CatchUnexpected } from '../lib/Decorators';

@CatchUnexpected(500)
export class AuthController extends BaseController {

    constructor(private authService: AuthService, private logger: Logger) {
        super();
        this.logger.debug('initialized');
    }

    public async authenticateUser(req: express.Request, res: express.Response): Promise<void> {
        const { email, password } = req.body;

        if (await this.authService.validateCredentials(email, password)) {
            const token = await this.authService.signAccessToken(email);

            res.send({ token });
        } else {
            this.logger.info(`invalid auth attempt: [${email}]`);
            res.status(400).send();
        }
    }
}
