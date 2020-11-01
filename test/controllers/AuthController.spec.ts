// tslint:disable: only-arrow-functions
import { expect } from "chai";

import sinon from "sinon";

import { AuthController } from "../../src/controllers/AuthController";

describe("Auth Controller", () => {
    describe("user authentication", async () => {
        it("should send access token to user given valid credentials", async () => {
            const request = {
                body: {
                    email: "email@test.com",
                    password: "123456"
                }
            };
            const authService = {
                validateCredentials: sinon.stub().resolves(true),
                signTemporaryToken: sinon.stub().resolves("auth-token")
            }
            // @ts-ignore
            const authController = new AuthController(authService, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await authController.authenticateUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithMatch({
                auth: "auth-token",
            })).to.be.true;
        });

        it("should send 400 bad request given invalid credentials", async () => {
            const request = {
                body: {
                    email: "email@test.com",
                    password: "123456"
                }
            };
            const authService = {
                validateCredentials: sinon.stub().resolves(false)
            }
            // @ts-ignore
            const authController = new AuthController(authService, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await authController.authenticateUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(400)).to.be.true;
        });

        it("should return 500 status code in case internal error", async () => {
            const request = {
                body: {
                    email: "email@test.com",
                    password: "123456"
                }
            };
            const authService = {
                validateCredentials: sinon.stub().rejects(new Error('unexpected error'))
            }
            // @ts-ignore
            const authController = new AuthController(authService, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await authController.authenticateUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(500)).to.be.true;
        });
    });
});
