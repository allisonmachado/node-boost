import express from "express";

import { IAuthService, UserJwtPayload } from "../services/IAuthService";

export class AuthMiddleware {
    constructor(private authService: IAuthService) { }

    public async verify(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const token = this.getTokenFromBearer(req);
            const contents = await this.authService.validateAccessToken(token);
            (req as AuthRequestInfo).user = contents;
            next();
        } catch (error) {
            if (
                error.message == "No Authorization Header" ||
                error.message == "Invalid Token Format"
            ) {
                res.status(401).json({
                    message: "Invalid Auth Token",
                    error: error.message
                });
            } else {
                res.status(500).send();
            }
        }
    };

    private getTokenFromBearer(req: express.Request): string {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new Error("No Authorization Header");
        }
        try {
            const token = authorization?.split("Bearer ")[1];
            return token;
        } catch {
            throw new Error("Invalid Token Format");
        }
    }
}

export interface AuthRequestInfo extends express.Request {
    user: UserJwtPayload;
}