import express from "express";

import { HandleExceptions } from "../Advices";
import { BaseController } from "../BaseController";
import { InputFilter } from "./InputFilter";
import { UserService } from "../../services/UserService";
import { CheckTypes } from "../../lib/CheckTypes";
import { Logger } from "../../lib/Logger";

@HandleExceptions
export class UserController extends BaseController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        private userService: UserService,
        private userRequestValidator: InputFilter,
    ) {
        super();
        this.logger.debug(`initialized`);
    }

    public async getUsers(req: express.Request, res: express.Response): Promise<void> {
        let users = await this.userService.list();
        res.send(users);
    }

    public async createUser(req: express.Request, res: express.Response): Promise<void> {
        const name = req.body['name'];
        const surname = req.body['surname'];
        const email = req.body['email'];
        const password = req.body['password'];

        if (!this.userRequestValidator.isCreateParamsValid(
            name, surname, email, password,
        )) {
            res.status(400).send();
            return;
        }
        const userId = await this.userService.create(
            name, surname, email, password,
        );
        res.status(201).send({ id: userId, name, surname, email });
    }

    public async getUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params['id'];
        if (!this.userRequestValidator.isValidId(id)) {
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

    public async updateUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params['id'];
        const name = req.body['name'];
        const surname = req.body['surname'];
        const password = req.body['password'];

        if (!this.userRequestValidator.isUpdateParamsValid(id, name, surname, password)) {
            res.status(400).send();
            return;
        }
        const affectedRows = await this.userService.update(id, name, surname, password)
        if (affectedRows === 1) {
            res.send({ id, name, surname, password });
        } else {
            res.status(404).send();
            return;
        }
    }

    public async deleteUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.params['id'];
        if (!this.userRequestValidator.isValidId(id)) {
            res.status(400).send();
            return;
        }
        const affectedRows = await this.userService.delete(parseInt(id));
        if (affectedRows === 1) {
            res.send({ id });
        } else {
            res.status(404).send();
            return;
        }
    }
}