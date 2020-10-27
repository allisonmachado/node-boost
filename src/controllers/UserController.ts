import express from "express";

import { CatchDuplicateEntry, CatchUnexpected } from "./Decorators";
import { BaseController } from "./BaseController";
import { IUserService } from "../services/IUserService";
import { ILogger } from "../lib/ILogger";

@CatchUnexpected
export class UserController extends BaseController {

    constructor(private userService: IUserService, private logger: ILogger) {
        super();
        this.logger.debug(`initialized`);
    }

    public async getUsers(req: express.Request, res: express.Response): Promise<void> {
        let users = await this.userService.list();
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
        const id = parseInt(req.params.id);
        const users = await this.userService.findById(id);
        if (!users) {
            res.status(404).send();
            return;
        }
        res.send(users);
    }

    public async updateUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params.id;
        const name = req.body.name;
        const surname = req.body.surname;
        const password = req.body.password;

        const affectedRows = await this.userService.update(id, name, surname, password)
        if (affectedRows === 1) {
            res.send({ id, name, surname, password });
        } else {
            res.status(404).send();
            return;
        }
    }

    public async deleteUser(req: express.Request, res: express.Response): Promise<void> {
        const affectedRows = await this.userService.delete(parseInt(req.params.id));
        if (affectedRows === 1) {
            res.status(204).send();
        } else {
            res.status(404).send();
            return;
        }
    }
}