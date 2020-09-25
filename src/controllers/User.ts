import express from "express";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
    constructor(protected express: express.Express) {
        super(express);
        this.express.get("/users", this.listUsers.bind(this))
    }

    private async listUsers(req: express.Request, res: express.Response): Promise<void> {
        let users = [
            {id: 1, name: "Paul"},
            {id: 2, name: "John"}
        ]
        res.send(users);
    }
}