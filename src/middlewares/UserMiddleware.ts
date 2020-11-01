import express from "express";
import validator from "validator";

import { CatchUnexpected } from "../lib/Decorators";
import { ILogger } from "../lib/ILogger";

@CatchUnexpected(400)
export class UserMiddleware {

    constructor(private logger: ILogger) {

    }

    public async verifyCreateUserParams(
        req: express.Request, res: express.Response, next: express.NextFunction,
    ): Promise<void> {
        if (!req.body) {
            res.status(400).send();
            return;
        }
        if (
            validator.isLength(req.body.name, { min: 2, max: 145 }) &&
            validator.isLength(req.body.surname, { min: 2, max: 145 }) &&
            validator.isLength(req.body.password, { min: 8, max: 200 }) &&
            validator.isEmail(req.body.email)
        ) {
            next();
        } else {
            res.status(400).send();
        }
    }

    public async verifyGetUserParams(
        req: express.Request, res: express.Response, next: express.NextFunction,
    ): Promise<void> {
        if (!req.params) {
            res.status(400).send();
            return;
        }
        if (validator.isInt(req.params.id)) {
            next();
        } else {
            res.status(400).send();
        }
    }

    public async verifyDeleteUserParams(
        req: express.Request, res: express.Response, next: express.NextFunction,
    ): Promise<void> {
        return this.verifyGetUserParams(req, res, next);
    }

    public async verifyUpdateUserParams(
        req: express.Request, res: express.Response, next: express.NextFunction,
    ): Promise<void> {
        if (!req.body || !req.params) {
            res.status(400).send();
            return;
        }
        if (
            validator.isInt(req.params.id) &&
            validator.isLength(req.body.name, { min: 2, max: 145 }) &&
            validator.isLength(req.body.surname, { min: 2, max: 145 }) &&
            validator.isLength(req.body.password, { min: 8, max: 200 })
        ) {
            next();
        } else {
            res.status(400).send();
        }
    }
}
