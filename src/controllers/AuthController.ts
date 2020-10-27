import express from "express";

import { ILogger } from "../lib/ILogger";
import { IAuthService } from "../services/IAuthService";
import { BaseController } from "./BaseController";
import { CatchUnexpected } from "./Decorators";

@CatchUnexpected
export class AuthController extends BaseController {

    constructor(private authService: IAuthService, private logger: ILogger) {
        super();
        this.logger.debug(`initialized`);
    }

    public async authenticateUser(req: express.Request, res: express.Response): Promise<void> {
        const email = req.body.email;
        const password = req.body.password;

        if (await this.authService.validateCredentials(email, password)) {
            const token = await this.authService.signTemporaryToken(email);
            res.send({
                auth: token,
            });
        } else {
            this.logger.info(`invalid auth attempt: [${email}]`);
            res.status(400).send();
        }
    }
}
