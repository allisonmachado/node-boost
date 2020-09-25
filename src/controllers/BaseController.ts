import express from "express";
import { CheckTypes } from "../CheckTypes";

export abstract class BaseController {
    constructor(protected express: express.Express) {
        if (CheckTypes.isNullOrUndefined(express)) {
            throw new Error(`all controllers required express for routing definition`);
        }
    }
}