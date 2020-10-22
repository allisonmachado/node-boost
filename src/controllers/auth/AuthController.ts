import express from "express";

import { Logger } from "../../lib/Logger";
import { InputFilter } from "./InputFilter";
import { AuthService } from "../../business/AuthService";
import { BaseController } from "../BaseController";
import { HandleExceptions } from "../Advices";

@HandleExceptions
export class AuthController extends BaseController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        protected express: express.Express,
        private authService: AuthService,
        private authServiceValidator: InputFilter,
    ) {
        super(express);
        this.express.post("/auth", this.authenticateUser.bind(this));
    }

    private async authenticateUser(req: express.Request, res: express.Response): Promise<void> {
        const email = req.body['email'];
        const password = req.body['password'];

        if (!this.authServiceValidator.isAuthParamsValid(
            email, password,
        )) {
            res.status(400).send();
            return
        }
        if (await this.authService.validateCredentials(email, password)) {
            const token = await this.authService.signTemporaryToken(email);
            res.send({
                accessToken: token
            });
        } else {
            res.status(400).send();
        }
    }
}