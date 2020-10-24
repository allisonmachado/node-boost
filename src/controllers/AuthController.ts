import express from "express";

import { Logger } from "../lib/Logger";
import { AuthService } from "../services/AuthService";
import { BaseController } from "./BaseController";
import { HandleExceptions } from "./Advices";

@HandleExceptions
export class AuthController extends BaseController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) {
        super();
    }

    public async authenticateUser(req: express.Request, res: express.Response): Promise<void> {
        const email = req.body.email;
        const password = req.body.password;

        if (await this.authService.validateCredentials(email, password)) {
            const token = await this.authService.signTemporaryToken(email);
            res.send({
                auth: token
            });
        } else {
            this.logger.info(`invalid auth attempt: [${email}]`);
            res.status(400).send();
        }
    }
}