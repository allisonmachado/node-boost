import express from "express";

export abstract class BaseController {
    constructor(protected express: express.Express) {}
}