import express from "express";

import { UserService } from "../business/UserService";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
    constructor(
        protected express: express.Express,
        private userService: UserService,
    ) {
        super(express);
        this.express.get("/users", this.listUsers.bind(this))
    }

    private async listUsers(req: express.Request, res: express.Response): Promise<void> {
        let users = await this.userService.list();
        res.send(users);
    }
}