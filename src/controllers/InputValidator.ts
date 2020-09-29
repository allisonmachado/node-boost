import validator from "validator";

import { CheckTypes } from "../CheckTypes";

export class InputValidator {
    public static isLength(data: any, min: number, max: number) {
        return CheckTypes.isTypeString(data) && validator.isLength(data, { min, max });
    }

    public static isInteger(data: any) {
        return CheckTypes.isTypeString(data) && validator.isInt(data);
    }
}
