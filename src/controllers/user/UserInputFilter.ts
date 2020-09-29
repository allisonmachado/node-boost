import { ReturnFalseOnError } from "../Advices";
import { InputFilter } from "./InputFilter";
import { CheckTypes } from "../../CheckTypes";

import validator from "validator";

@ReturnFalseOnError
export class UserInputFilter implements InputFilter {
    public isCreateRequestValid(name: any, surname: any, email: any, password: any): boolean {
        return (
            validator.isLength(name, { min: 2, max: 145 }) &&
            validator.isLength(surname, { min: 2, max: 145 }) &&
            validator.isLength(password, { min: 8, max: 200 }) &&
            validator.isEmail(email)
        );
    }

    public isGetRequestValid(id: any): boolean {
        return validator.isInt(id);
    }

    public isUpdateRequestValid(name: any, surname: any, password: any): boolean {
        return (
            (CheckTypes.isNullOrUndefined(name) || validator.isLength(name, { min: 2, max: 145 }))
            &&
            (CheckTypes.isNullOrUndefined(surname) || validator.isLength(surname, { min: 2, max: 145 }))
            &&
            (CheckTypes.isNullOrUndefined(password) || validator.isLength(password, { min: 8, max: 200 }))
        );
    }
}