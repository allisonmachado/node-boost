import express from "express";

import { HandleExceptions } from "../Advices";
import { BaseController } from "../BaseController";
import { InputFilter } from "./InputFilter";
import { UserService } from "../../business/UserService";
import { CheckTypes } from "../../CheckTypes";
import { Logger } from "../../Logger";

@HandleExceptions
export class UserController extends BaseController {
    private readonly logger = new Logger(UserController.name);

    constructor(
        protected express: express.Express,
        private userService: UserService,
        private userRequestValidator: InputFilter,
    ) {
        super(express);
        this.express.post("/users", this.createUser.bind(this));
        this.express.get("/users", this.getUsers.bind(this));
        this.express.get("/users/:id", this.getUser.bind(this));
        this.express.put("/users", this.updateUser.bind(this));
        this.logger.debug(`initialized`);
    }

    private async createUser(req: express.Request, res: express.Response): Promise<void> {
        const name = req.body['name'];
        const surname = req.body['surname'];
        const email = req.body['email'];
        const password = req.body['password'];

        if (!this.userRequestValidator.isCreateRequestValid(
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

    private async updateUser(req: express.Request, res: express.Response): Promise<void> {
        const id = req.body['id'];
        const name = req.body['name'];
        const surname = req.body['surname'];
        const password = req.body['password'];

        if (!this.userRequestValidator.isUpdateRequestValid(id, name, surname, password)) {
            res.status(400).send();
            return;
        }
        const affectedRows = await this.userService.update(id, name, surname, password)
        if (affectedRows === 1) {
            res.send({ id, name, surname, password });
        } else {
            res.status(400).send();
            return;
        }
    }
}