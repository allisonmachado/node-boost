import express from 'express';
import Joi from 'joi';

import { CatchUnexpected } from '../lib/Decorators';
import { Logger } from '../lib/Logger';

@CatchUnexpected(400)
export class UserMiddleware {

    constructor(private logger: Logger) {

    }

    public async verifyCreateUserParams(
        req: express.Request, res: express.Response, next: express.NextFunction,
    ): Promise<void> {
        if (Joi.object({
            name: Joi.string().required(),
            surname: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6),
        }).validate(req.body).error) {
            res.status(400).send();
        } else {
            next();
        }
    }

    public async verifyGetUserParams(
        req: express.Request, res: express.Response, next: express.NextFunction,
    ): Promise<void> {
        if (Joi.string().regex(/^\d+$/).validate(req.params?.id).error) {
            res.status(400).send();
        } else {
            next();
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
        if (Joi.object({
            id: Joi.string().regex(/^\d+$/),
            name: Joi.string().required(),
            surname: Joi.string().required(),
            password: Joi.string().required().min(6),
        }).validate(req.body).error) {
            res.status(400).send();
        } else {
            next();
        }
    }

    public async verifyAuthenticateUserParams(
        req: express.Request, res: express.Response, next: express.NextFunction,
    ): Promise<void> {
        if (Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required().min(6).max(200),
        }).validate(req.body).error) {
            res.status(400).send();
        } else {
            next();
        }
    }
}
