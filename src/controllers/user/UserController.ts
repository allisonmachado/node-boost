import express from "express";

import { HandleExceptions } from "../HandleExceptions";
import { BaseController } from "../BaseController";
import { RequestFilter } from "./RequestFilter";
import { UserService } from "../../business/UserService";
import { CheckTypes } from "../../CheckTypes";
import { Logger } from "../../Logger";

@HandleExceptions
export class UserController extends BaseController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        protected express: express.Express,
        private userService: UserService,
        private userRequestValidator: RequestFilter,
    ) {
        super(express);
        this.express.post("/users", this.createUser.bind(this))
        this.express.get("/users", this.getUsers.bind(this))
        this.express.get("/users/:id", this.getUser.bind(this))
        this.logger.debug(`initialized`);
    }

    private async createUser(req: express.Request, res: express.Response): Promise<void> {
        if (!this.userRequestValidator.isCreateRequestValid(req)) {
            res.status(400).send();
            return;
        }
        const userId = await this.userService.create(
            req.body['name'],
            req.body['surname'],
            req.body['email'],
            req.body['password'],
        );
        res.send({
            id: userId,
            name: req.body['name'],
            surname: req.body['surname'],
            email: req.body['email']
        });
    }

    private async getUsers(req: express.Request, res: express.Response): Promise<void> {
        let users = await this.userService.list();
        res.send(users);
    }

    private async getUser(req: express.Request, res: express.Response): Promise<void> {
        if (!this.userRequestValidator.isGetRequestValid(req)) {
            res.status(400).send();
            return;
        }
        const users = await this.userService.findById(parseInt(req.params['id']));
        if (!CheckTypes.hasContent(users)) {
            res.status(404).send();
            return;
        }
        res.send(users);
    }
}