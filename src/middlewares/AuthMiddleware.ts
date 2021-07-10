import express from 'express';

import { Logger } from '../lib/Logger';
import { AuthService, UserJwtPayload } from '../services/AuthService';

export class AuthMiddleware {
  constructor(private authService: AuthService, private logger: Logger) {
    this.logger.debug('initialized');
  }

  public async verify(
    req: express.Request & { user: UserJwtPayload | undefined },
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    try {
      const token = this.getTokenFromHeader(req);
      const contents = await this.authService.validateAccessToken(token);

      req.user = contents;
      next();
    } catch (error) {
      if (this.isTokenError(error)) {
        res.status(401).json({ message: 'Invalid Auth Token', error: error.message });
      } else {
        res.status(500).send();
      }
    }
  }

  private getTokenFromHeader(req: express.Request): string {
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
    const tokenErrors = [
      'JsonWebTokenError',
      'TokenExpiredError',
      'NotBeforeError',
      'No Authorization Header',
      'Invalid Token Format',
      'Invalid decoded jwt payload',
    ];
    return tokenErrors.find(e => error.message.includes(e) || error.name === e);
  }
}

export interface AuthenticatedRequest extends express.Request {
    user: UserJwtPayload;
}
