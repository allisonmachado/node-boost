/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AuthController } from '../../src/controllers/AuthController';
import { BaseLogger } from '../../src/lib/Logger';
import { expect } from 'chai';

import sinon from 'sinon';

describe('Auth Controller', () => {
  const logger = new BaseLogger('Auth Controller Spec');
    

  describe('user authentication', async () => {
    it('should send access token to user given valid credentials', async () => {
      const authService = {
        validateCredentials: sinon.stub().resolves(true),
        signAccessToken: sinon.stub().resolves('auth-token')
      };
      // @ts-ignore
      const authController = new AuthController(authService, logger);
      const request = {
        body: {
          email: 'email@test.com',
          password: '123456'
        }
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub().returnsThis()
      };
      // @ts-ignore
      await authController.authenticateUser(request, response);

      expect(response.send.calledOnce).to.be.true;
      expect(response.send.calledWithMatch({
        token: 'auth-token',
      })).to.be.true;
    });

    it('should send 400 bad request given invalid credentials', async () => {
      const request = {
        body: {
          email: 'email@test.com',
          password: '123456'
        }
      };
      const authService = {
        validateCredentials: sinon.stub().resolves(false)
      };
      // @ts-ignore
      const authController = new AuthController(authService, logger);
      const response = {
        send: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // @ts-ignore
      await authController.authenticateUser(request, response);

      expect(response.send.calledOnce).to.be.true;
      expect(response.send.calledWithExactly()).to.be.true;
      expect(response.status.calledOnce).to.be.true;
      expect(response.status.calledWithExactly(400)).to.be.true;
    });

    it('should return 500 status code in case internal error', async () => {
      const request = {
        body: {
          email: 'email@test.com',
          password: '123456'
        }
      };
      const authService = {
        validateCredentials: sinon.stub().rejects(new Error('unexpected error'))
      };
      // @ts-ignore
      const authController = new AuthController(authService, logger);
      const response = {
        send: sinon.spy(),
        status: sinon.stub().returnsThis()
      };

      // @ts-ignore
      await authController.authenticateUser(request, response);

      expect(response.send.calledOnce).to.be.true;
      expect(response.send.calledWithExactly()).to.be.true;
      expect(response.status.calledOnce).to.be.true;
      expect(response.status.calledWithExactly(500)).to.be.true;
    });
  });
});
