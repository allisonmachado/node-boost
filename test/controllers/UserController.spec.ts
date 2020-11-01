// tslint:disable: only-arrow-functions
import { expect } from "chai";
import { UserController } from "../../src/controllers/UserController";

import sinon from "sinon";

describe("User Controller", () => {
    describe("user listing request handling", async () => {
        it("should list users", async () => {
            const userList = [
                { "id": 2, "name": "Van", "surname": "Nisteroy", "email": "vanroy@email.com" },
                { "id": 3, "name": "Matter", "surname": "Maswebbe", "email": "webmaster@email.com" }
            ];
            const userService = {
                list: sinon.stub().resolves(userList)
            }
            // @ts-ignore
            const userController = new UserController(userService, console);
            const response = { send: sinon.spy() }

            await userController.getUsers(null, response as any);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly(userList)).to.be.true;
        });

        it("should return 500 status code in case internal error", async () => {
            const userList = [
                { "id": 2, "name": "Van", "surname": "Nisteroy", "email": "vanroy@email.com" },
                { "id": 3, "name": "Matter", "surname": "Maswebbe", "email": "webmaster@email.com" }
            ];
            const userService = {
                list: sinon.stub().rejects(new Error('unexpected error'))
            }
            // @ts-ignore
            const userController = new UserController(userService, console);
            const response = { send: sinon.spy(), status: sinon.stub().returnsThis() }

            // @ts-ignore
            await userController.getUsers(null, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(500)).to.be.true;
        });
    });

    describe("user creation request handling", async () => {
        it("should create a new user given the user properties in a request", async () => {
            const request = {
                body: {
                    name: 'Foo',
                    surname: 'Bar',
                    email: 'foobar@email.com',
                    password: 'abc123456'
                }
            }
            const userService = {
                create: sinon.stub().resolves(1)
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.createUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithMatch({
                id: 1,
                name: request.body.name,
                surname: request.body.surname,
                email: request.body.email,
            })).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(201)).to.be.true;
        });

        it("should return 500 status code in case internal error", async () => {
            const request = {}
            const userService = {
                create: sinon.stub().rejects(new Error('Mysql err: ER_DUP_ENTRY'))
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.createUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(500)).to.be.true;
        });

        it("should return 409 status code in case of a duplicate entry", async () => {
            const request = {
                body: {
                    name: 'Foo',
                    surname: 'Bar',
                    email: 'foobar@email.com',
                    password: 'abc123456'
                }
            }
            const userService = {
                create: sinon.stub().rejects(new Error('Mysql err: ER_DUP_ENTRY'))
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.createUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(409)).to.be.true;
        });
    });

    describe("user query by id request handling", async () => {
        it("should return existing user by id", async () => {
            const user = {
                "id": 10,
                "name": "Foo",
                "surname": "Bar",
                "email": "foobar@email.com"
            };
            const request = { params: { id: "10" } };
            const userService = {
                findById: sinon.stub().resolves(user)
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.getUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly(user)).to.be.true;
        });

        it("should return 404 status code in case user is not found", async () => {
            const request = { params: { id: "10" } };
            const userService = {
                findById: sinon.stub().resolves()
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.getUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(404)).to.be.true;
        });

        it("should return 500 status code in case internal error", async () => {
            const request = {}
            const userService = {
                findById: sinon.stub().rejects(new Error('Unexpected error'))
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.getUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(500)).to.be.true;
        });
    });

    describe("user update by id request handling", async () => {
        it("should update user by given id param and body info", async () => {
            const request = {
                params: { id: "10" },
                body: {
                    "name": "Foo",
                    "surname": "Bar",
                    "password": "123456"
                }
            };
            const userService = {
                update: sinon.stub().resolves(1)
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.updateUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(204)).to.be.true;
        });

        it("should return 404 status code in case user is not found", async () => {
            const request = {
                params: { id: "1" },
                body: {
                    "name": "Foo",
                    "surname": "Bar",
                    "password": "123456"
                }
            };
            const userService = {
                update: sinon.stub().resolves(0)
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.updateUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(404)).to.be.true;
        });

        it("should return 500 status code in case internal error", async () => {
            const request = {}
            const userService = {
                update: sinon.stub().rejects(new Error('Unexpected error'))
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.updateUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(500)).to.be.true;
        });
    });

    describe("user delete by id request handling", async () => {
        it("should delete user by given id", async () => {
            const request = { params: { id: "10" } };
            const userService = {
                delete: sinon.stub().resolves(1)
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.deleteUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(204)).to.be.true;
        });

        it("should return 404 status code in case user is not found", async () => {
            const request = { params: { id: "10" } };
            const userService = {
                delete: sinon.stub().resolves(0)
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.deleteUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(404)).to.be.true;
        });

        it("should return 500 status code in case internal error", async () => {
            const request = {}
            const userService = {
                delete: sinon.stub().rejects(new Error('Unexpected error'))
            }
            const userController = new UserController(userService as any, console);
            const response = {
                send: sinon.spy(),
                status: sinon.stub().returnsThis()
            }

            // @ts-ignore
            await userController.deleteUser(request, response);

            expect(response.send.calledOnce).to.be.true;
            expect(response.send.calledWithExactly()).to.be.true;
            expect(response.status.calledOnce).to.be.true;
            expect(response.status.calledWithExactly(500)).to.be.true;
        });
    });
});
