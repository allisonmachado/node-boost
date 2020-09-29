import express from "express";
        
export interface InputFilter {
    isCreateRequestValid(name: any, surname: any, email: any, password: any): boolean;
    isGetRequestValid(req: express.Request): boolean;
    isUpdateRequestValid(id: any, name: any, surname: any, password: any): boolean;
}