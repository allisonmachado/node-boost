import express from "express";

import { CatchActionForbidden, CatchDuplicateEntry } from "./Decorators";
import { IAuthenticatedRequest } from "../middlewares/AuthMiddleware";
import { CatchUnexpected } from "../lib/Decorators";
import { BaseController } from "./BaseController";
import { IUserService } from "../services/IUserService";
import { ILogger } from "../lib/ILogger";

@CatchUnexpected(500)
export class UserController extends BaseController {

    constructor(private userService: IUserService, private logger: ILogger) {
        super();
        this.logger.debug(`initialized`);
    }

    public async getUsers(req: express.Request, res: express.Response): Promise<void> {
        const users = await this.userService.list();
        res.send(users);
    }

    @CatchDuplicateEntry
    public async createUser(req: express.Request, res: express.Response): Promise<void> {
        const name = req.body.name;
        const surname = req.body.surname;
        const email = req.body.email;
        const password = req.body.password;

        const userId = await this.userService.create(name, surname, email, password);
        res.status(201).send({ id: userId, name, surname, email });
    }

    public async getUser(req: express.Request, res: express.Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const users = await this.userService.findById(id);
        if (!users) {
            res.status(404).send();
        } else {
            res.send(users);
        }
    }

    public async updateUser(req: express.Request, res: express.Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        const name = req.body.name;
        const surname = req.body.surname;
        const password = req.body.password;

        const affectedRows = await this.userService.update(id, name, surname, password);
        if (affectedRows === 1) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    }

    @CatchActionForbidden
    public async deleteUser(req: IAuthenticatedRequest, res: express.Response): Promise<void> {
        const affectedRows = await this.userService.delete(parseInt(req.params.id, 10), req.user.id);
        if (affectedRows === 1) {
            res.status(204).send();
        } else {
            res.status(404).send();
        }
    }
}
