import { ReturnFalseOnError } from "../Advices";
import { InputFilter } from "./InputFilter";

@ReturnFalseOnError
export class AuthInputFilter implements InputFilter {
    public isAuthParamsValid(email: any, password: any): boolean {
        return true;
    }
}