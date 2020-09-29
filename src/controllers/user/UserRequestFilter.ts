import { RequestFilter } from "./RequestFilter";
import { CheckTypes } from "../../CheckTypes";

import validator from "validator";
import express from "express";

export class UserRequestFilter implements RequestFilter {
    public isCreateRequestValid(req: express.Request): boolean {
        return (
            CheckTypes.isTypeString(req.body['name']) && validator.isLength(req.body['name'], { min: 2, max: 145 }) &&
            CheckTypes.isTypeString(req.body['surname']) && validator.isLength(req.body['surname'], { min: 2, max: 145 }) &&
            CheckTypes.isTypeString(req.body['email']) && validator.isLength(req.body['email'], { min: 2, max: 100 }) &&
            CheckTypes.isTypeString(req.body['password']) && validator.isLength(req.body['password'], { min: 8, max: 200 })
        );
    }

    public isGetRequestValid(req: express.Request): boolean {
        return validator.isInt(req.params['id']);
    }
}