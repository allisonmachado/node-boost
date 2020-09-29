import express from "express";

import { HandleExceptions } from "./HandleExceptions";
import { BaseController } from "./BaseController";
import { InputValidator } from "./InputValidator";
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
        this.express.post("/users", this.createUser.bind(this))
        this.express.get("/users", this.getUsers.bind(this))
        this.express.get("/users/:id", this.getUser.bind(this))
        this.logger.debug(`initialized`);
    }

    private async createUser(req: express.Request, res: express.Response): Promise<void> {
        if (
            !InputValidator.isLength(req.body['name'], 2, 145) ||
            !InputValidator.isLength(req.body['surname'], 2, 145) ||
            !InputValidator.isLength(req.body['email'], 2, 100) ||
            !InputValidator.isLength(req.body['password'], 8, 200)
        ) {
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
        if (!InputValidator.isInteger(req.params['id'])) {
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