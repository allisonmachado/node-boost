export interface InputFilter {
    isCreateParamsValid(name: any, surname: any, email: any, password: any): boolean;
    isValidId(id: any): boolean;
    isUpdateParamsValid(id: any, name: any, surname: any, password: any): boolean;
}