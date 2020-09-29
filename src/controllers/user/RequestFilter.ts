import express from "express";
        
export interface RequestFilter {
    isCreateRequestValid(req: express.Request): boolean;
    isGetRequestValid(req: express.Request): boolean;
    isUpdateRequestValid(req: express.Request): boolean;
}