import express from "express";

import { Logger } from "../../lib/Logger";
import { InputFilter } from "./InputFilter";
import { AuthService } from "../../services/AuthService";
import { Environment } from "../../lib/Environment";
import { BaseController } from "../BaseController";
import { HandleExceptions } from "../Advices";

@HandleExceptions
export class AuthController extends BaseController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private authService: AuthService,
        private authServiceValidator: InputFilter,
    ) {
        super();
    }

    public async authenticateUser(req: express.Request, res: express.Response): Promise<void> {
        const email = req.body['email'];
        const password = req.body['password'];

        if (!this.authServiceValidator.isAuthParamsValid(
            email, password,
        )) {
            res.status(400).send();
            return;
        }
        if (await this.authService.validateCredentials(email, password)) {
            const token = await this.authService.signTemporaryToken(email);
            res.send({
                accessToken: token
            });
        } else {
            this.logger.info(`invalid auth attempt: [${email}]`);
            res.status(400).send();
        }
    }

    public async verifyToken(req: express.Request, res: express.Response): Promise<void> {
        if (!Environment.isLocal()) {
            res.status(404).send();
            return;
        }
        const token = req.body['accessToken'];
        try {
            const value = await this.authService.validateAccessToken(token);
            res.send({ value })
        } catch (error) {
            res.send({ value: null })
        }
    }
}