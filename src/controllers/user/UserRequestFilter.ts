import { RequestFilter } from "./RequestFilter";
import { CheckTypes } from "../../CheckTypes";

import validator from "validator";
import express from "express";
import { ReturnFalseOnError } from "../Advices";

@ReturnFalseOnError
export class UserRequestFilter implements RequestFilter {
    public isCreateRequestValid(req: express.Request): boolean {
        return (
            validator.isLength(req.body['name'], { min: 2, max: 145 }) &&
            validator.isLength(req.body['surname'], { min: 2, max: 145 }) &&
            validator.isLength(req.body['email'], { min: 2, max: 100 }) &&
            validator.isLength(req.body['password'], { min: 8, max: 200 })
        );
    }

    public isGetRequestValid(req: express.Request): boolean {
        return validator.isInt(req.params['id']);
    }

    public isUpdateRequestValid(req: express.Request): boolean {
        return (
            (CheckTypes.isNullOrUndefined(req.body['name']) || validator.isLength(req.body['name'], { min: 2, max: 145 }))
            &&
            (CheckTypes.isNullOrUndefined(req.body['surname']) || validator.isLength(req.body['surname'], { min: 2, max: 145 }))
            &&
            (CheckTypes.isNullOrUndefined(req.body['email']) || validator.isLength(req.body['email'], { min: 2, max: 100 }))
        );
    }
}