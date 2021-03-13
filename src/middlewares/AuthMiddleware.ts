import express from 'express';

import { ILogger } from '../lib/ILogger';
import { IAuthService, IUserJwtPayload } from '../services/IAuthService';

export class AuthMiddleware {
    constructor(private authService: IAuthService, private logger: ILogger) {
        this.logger.debug('initialized');
    }

    public async verify(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        try {
            const token = this.getTokenFromBearer(req);
            const contents = await this.authService.validateAccessToken(token);
            (req as IAuthenticatedRequest).user = contents;
            next();
        } catch (error) {
            if (this.isTokenError(error)) {
                res.status(401).json({ message: 'Invalid Auth Token', error: error.message });
            } else {
                res.status(500).send();
            }
        }
    }

    private getTokenFromBearer(req: express.Request): string {
        const authorization = req.headers.authorization;
        if (!authorization) {
            throw new Error('No Authorization Header');
        }
        try {
            const token = authorization?.split('Bearer ')[1];
            return token;
        } catch {
            throw new Error('Invalid Token Format');
        }
    }

    private isTokenError(error: Error) {
        const knownErrors = [
            'JsonWebTokenError',
            'TokenExpiredError',
            'NotBeforeError',
            'No Authorization Header',
            'Invalid Token Format',
            'Invalid decoded jwt payload',
        ];
        return knownErrors.find(e => error.message.includes(e) || error.name === e);
    }
}

export interface IAuthenticatedRequest extends express.Request {
    user: IUserJwtPayload;
}
