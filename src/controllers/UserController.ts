import express from "express";
import validator from "validator";

import { HandleExceptions } from "./HandleExceptions";
import { BaseController } from "./BaseController";
import { UserService } from "../business/UserService";
import { CheckTypes } from "../CheckTypes";
import { Logger } from "../Logger";

@HandleExceptions
export class UserController extends BaseController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        protected express: express.Express,
        private userService: UserService,
    ) {
        super(express);
        this.express.get("/users", this.getUsers.bind(this))
        this.express.get("/users/:id", this.getUser.bind(this))
        this.logger.debug(`initialized`);
    }

    private async getUsers(req: express.Request, res: express.Response): Promise<void> {
        let users = await this.userService.list();
        res.send(users);
    }

    private async getUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params['id'];
        if (!validator.isInt(id)) {
            res.status(400).send();
            return;
        }
        const users = await this.userService.findById(parseInt(id));
        if (!CheckTypes.hasContent(users)) {
            res.status(404).send();
            return;
        }
        res.send(users);
    }
}