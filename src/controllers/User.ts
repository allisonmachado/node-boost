import express from "express";

import { BaseController } from "./BaseController";
import { UserService } from "../business/UserService";
import { Logger } from "../Logger";

export class UserController extends BaseController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        protected express: express.Express,
        private userService: UserService,
    ) {
        super(express);
        this.express.get("/users", this.listUsers.bind(this))
        this.logger.debug(`initialized`);
    }

    private async listUsers(req: express.Request, res: express.Response): Promise<void> {
        let users = await this.userService.list();
        res.send(users);
    }
}