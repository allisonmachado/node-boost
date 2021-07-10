import express from 'express';

import { CatchActionForbidden, CatchDuplicateEntry, CatchUnexpected } from '../lib/Decorators';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { UserService } from '../services/UserService';
import { Logger } from '../lib/Logger';

@CatchUnexpected(500)
export class UserController {

  constructor(private userService: UserService, private logger: Logger) {
    this.logger.debug('initialized');
  }

  public async getUsers(_req: express.Request, res: express.Response): Promise<void> {
    const users = await this.userService.list();
    res.send(users);
  }

    @CatchDuplicateEntry
  public async createUser(req: express.Request, res: express.Response): Promise<void> {
    const user = req.body;

    const userId = await this.userService.create(user);
    res.status(201).send({ id: userId });
  }

    public async getUser(req: express.Request, res: express.Response): Promise<void> {
      const id = parseInt(req.params.id, 10);
      const users = await this.userService.findById(id);
      if (!users) {
        res.status(404).send();
      } else {
        res.send(users);
      }
    }

    public async updateUser(req: express.Request, res: express.Response): Promise<void> {
      const id = parseInt(req.params.id, 10);
      const user = { id, ...req.body };

      const affectedRows = await this.userService.update(user);
      if (affectedRows === 1) {
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    }

    @CatchActionForbidden
    public async deleteUser(req: AuthenticatedRequest, res: express.Response): Promise<void> {
      const affectedRows = await this.userService.delete(parseInt(req.params.id, 10), req.user.id);
      if (affectedRows === 1) {
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    }
}
