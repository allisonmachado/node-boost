// tslint:disable: only-arrow-functions
import { RequestMiddleware } from "../../src/middlewares/RequestMiddleware";
import { EmptyLogger } from "../../src/lib/EmptyLogger";
import { ILogger } from "../../src/lib/ILogger";
import { expect } from "chai";

import sinon from "sinon";

describe("Request Middleware", () => {
    const logger: ILogger = new EmptyLogger();

    describe("global error handling", async () => {
        it("for body-parser json syntax error should return 400 status code", async () => {
            const error = new SyntaxError(`unexpected string at JSON in position...`);

            // @ts-ignore
            const middleware = new RequestMiddleware(logger);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }
            const next = sinon.spy();

            // @ts-ignore
            await middleware.handleErrors(error, null, response, next);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(400)).to.be.true;
            expect(next.notCalled).to.be.true;
        });

        it("for unexpected errors should return 500 status code", async () => {
            const error = new Error();

            // @ts-ignore
            const middleware = new RequestMiddleware(logger);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }
            const next = sinon.spy();

            // @ts-ignore
            await middleware.handleErrors(error, null, response, next);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(500)).to.be.true;
            expect(next.notCalled).to.be.true;
        });
    });

    describe("request logging", async () => {
        it("should log method, url, status code and duration given a request response", async () => {
            const next = sinon.spy();
            const req = {
                method: 'GET',
                url: 'http://myapp.com'
            };
            const res = {
                statusCode: 200,
                on(event: string, callback: () => void) {
                    expect(event).to.equal("finish");
                    callback();
                }
            };
            const logger: ILogger = new EmptyLogger();
            logger.info = sinon.spy();
            const middleware = new RequestMiddleware(logger);

            // @ts-ignore
            middleware.log(req, res, next);

            // @ts-ignore
            expect(logger.info.calledOnce).to.be.true;

            // @ts-ignore
            expect(logger.info.firstCall.lastArg).to.equal('GET:http://myapp.com 200 - 0ms');
        });
    });
});