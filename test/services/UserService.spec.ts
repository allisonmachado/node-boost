// tslint:disable: only-arrow-functions
import { expect } from "chai";
import { ILogger } from "../../src/lib/ILogger";
import { UserEntity } from "../../src/data/entities/user/UserEntity";
import { UserService } from "../../src/services/UserService";
import { EmptyLogger } from "../../src/lib/EmptyLogger";

import sinon from "sinon";

import * as bcrypt from "bcryptjs";


describe("User Service", () => {
    const logger: ILogger = new EmptyLogger();

    describe("private implementations", async () => {
        it("should abstract bcrypt async password hashing method", async () => {
            const userService = new UserService(null, logger);
            const password = 'abcdefg';

            // @ts-ignore
            const hash = await userService.hashPassword(password);

            const equal = await new Promise((resolve, reject) => {
                bcrypt.compare(password, hash, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
            expect(equal).to.be.true;
        });

        it("should hide private user info", async () => {
            const userService = new UserService(null, logger);
            const users = [
                new UserEntity(
                    10, 'Foo', 'Bar', 'foo@email.com', '$2a$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e',
                )
            ]

            // @ts-ignore
            const userVisibleInfo = userService.visiblePropsMapper(users)[0];

            expect(userVisibleInfo.id).to.equal(10);
            expect(userVisibleInfo.name).to.equal("Foo");
            expect(userVisibleInfo.surname).to.equal("Bar");
            expect(userVisibleInfo.email).to.equal("foo@email.com");
            // @ts-ignore
            expect(userVisibleInfo.password).to.be.undefined;
        });
    });

    it("should request to persist a user given its properties and return its id", async () => {
        const userRepository = {
            create: sinon.stub().resolves(1)
        }
        // @ts-ignore
        const userService = new UserService(userRepository, logger);
        const userId = await userService.create('Foo', 'Bar', 'foo@email.com', '1234567')

        const [name, surname, email, password] = userRepository.create.firstCall.args;

        expect(userId).to.equal(1);

        expect(name).to.equal("Foo");
        expect(surname).to.equal("Bar");
        expect(email).to.equal("foo@email.com");

        const equal = await new Promise((resolve, reject) => {
            bcrypt.compare('1234567', password, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
        expect(equal).to.be.true;
    });

    it("should request users from persistance layer and retrieve them", async () => {
        const userRepository = {
            findTop10: sinon.stub().resolves([
                new UserEntity(
                    1, 'Foo', 'Bar', 'foo1@email.com', '$2b$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e',
                ),
                new UserEntity(
                    2, 'Foo', 'Bar', 'foo2@email.com', '$2a$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e',
                )
            ])
        }
        // @ts-ignore
        const userService = new UserService(userRepository, logger);
        const users = await userService.list();

        expect(users.length).to.equal(2);
        expect(users[0].email).to.equal('foo1@email.com');
        expect(users[1].email).to.equal('foo2@email.com');
    });

    it("should request users from persistance layer by Id and retrieve them", async () => {
        const userRepository = {
            findById: sinon.stub().resolves(new UserEntity(
                1, 'Foo', 'Bar', 'foo1@email.com', '$2b$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e',
            )),
        }
        // @ts-ignore
        const userService = new UserService(userRepository, logger);
        const user = await userService.findById(1);

        expect(user.id).to.equal(1);
        expect(user.name).to.equal("Foo");
        expect(user.surname).to.equal("Bar");
        expect(user.email).to.equal('foo1@email.com');
    });


    describe("request to update a user given its properties and id", async () => {
        it("update password if given", async () => {
            const userRepository = {
                update: sinon.stub().resolves(1)
            }
            // @ts-ignore
            const userService = new UserService(userRepository, logger);
            const userId = await userService.update(1, 'Foo', 'Bar', '1234567')

            const [id, name, surname, password] = userRepository.update.firstCall.args;

            expect(userId).to.equal(1);

            expect(id).to.equal(1);
            expect(name).to.equal("Foo");
            expect(surname).to.equal("Bar");

            const equal = await new Promise((resolve, reject) => {
                bcrypt.compare('1234567', password, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
            expect(equal).to.be.true;
        });

        it("do not change password if omitted", async () => {
            const userRepository = {
                update: sinon.stub().resolves(1)
            }
            // @ts-ignore
            const userService = new UserService(userRepository, logger);
            const userId = await userService.update(1, 'Foo', 'Bar', '')

            const [id, name, surname, password] = userRepository.update.firstCall.args;

            expect(userId).to.equal(1);

            expect(id).to.equal(1);
            expect(name).to.equal("Foo");
            expect(surname).to.equal("Bar");
            expect(password).to.equal("");
        });
    });

    it("should request persistance layer to remove user", async () => {
        const userRepository = {
            delete: sinon.stub().resolves(1)
        }
        // @ts-ignore
        const userService = new UserService(userRepository, logger);

        const affectedRows = await userService.delete(4);
        const [id] = userRepository.delete.firstCall.args;

        expect(affectedRows).to.equal(1);
        expect(id).to.equal(4);
    });
});
