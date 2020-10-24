import { ReturnFalseOnError } from "../Advices";
import { InputFilter } from "./InputFilter";
import { CheckTypes } from "../../lib/CheckTypes";

import validator from "validator";

@ReturnFalseOnError
export class UserInputFilter implements InputFilter {
    public isCreateParamsValid(name: any, surname: any, email: any, password: any): boolean {
        return (
            validator.isLength(name, { min: 2, max: 145 }) &&
            validator.isLength(surname, { min: 2, max: 145 }) &&
            validator.isLength(password, { min: 8, max: 200 }) &&
            validator.isEmail(email)
        );
    }

    public isValidId(id: any): boolean {
        return validator.isInt(id);
    }

    public isUpdateParamsValid(id: any, name: any, surname: any, password: any): boolean {
        return (
            validator.isInt(id) &&
            validator.isLength(name, { min: 2, max: 145 }) &&
            validator.isLength(surname, { min: 2, max: 145 }) &&
            validator.isLength(password, { min: 8, max: 200 })
        );
    }
}