/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect } from 'chai';
import { UserService } from '../../src/services/UserService';

import sinon from 'sinon';

import * as bcrypt from 'bcryptjs';
import { Logger } from '../../src/lib/Logger';


describe('User Service', () => {
    const logger = new Logger('User Service Spec');

    describe('private implementations', async () => {
        it('should abstract bcrypt async password hashing method', async () => {
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

        it('should hide private user info', async () => {
            const userService = new UserService(null, logger);
            const users = [{
                id: 10,
                name: 'Foo',
                surname: 'Bar',
                email: 'foo@email.com',
                password: '$2a$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e'
            }];

            // @ts-ignore
            const userVisibleInfo = userService.omitPassword(users)[0];

            expect(userVisibleInfo.id).to.equal(10);
            expect(userVisibleInfo.name).to.equal('Foo');
            expect(userVisibleInfo.surname).to.equal('Bar');
            expect(userVisibleInfo.email).to.equal('foo@email.com');
            // @ts-ignore
            expect(userVisibleInfo.password).to.be.undefined;
        });
    });

    it('should request to persist a user given its properties and return its id', async () => {
        const userRepository = {
            create: sinon.stub().resolves(1)
        };
        // @ts-ignore
        const userService = new UserService(userRepository, logger);
        const userId = await userService.create({
            name: 'Foo', surname: 'Bar', email: 'foo@email.com', password: '1234567'
        });

        const [[{ name, surname, email, password }]] = userRepository.create.args;

        expect(userId).to.equal(1);

        expect(name).to.equal('Foo');
        expect(surname).to.equal('Bar');
        expect(email).to.equal('foo@email.com');

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

    it('should request users from persistance layer and retrieve them', async () => {
        const userRepository = {
            findTop10: sinon.stub().resolves([{
                id: 1,
                name: 'Foo',
                surname: 'Bar',
                email: 'foo1@email.com',
                password: '$2b$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e',
            }, {
                id: 2,
                name: 'Foo',
                surname: 'Bar',
                email: 'foo2@email.com',
                password: '$2a$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e',
            }]),
        };
        // @ts-ignore
        const userService = new UserService(userRepository, logger);
        const users = await userService.list();

        expect(users.length).to.equal(2);
        expect(users[0].email).to.equal('foo1@email.com');
        expect(users[1].email).to.equal('foo2@email.com');
    });

    it('should request users from persistance layer by Id and retrieve them', async () => {
        const userRepository = {
            findById: sinon.stub().resolves({
                id: 1,
                name: 'Foo',
                surname: 'Bar',
                email: 'foo1@email.com',
                password: '$2b$10$S2Ngy9xiORAOq9R6g.6N7.20E1Q0NXa32CJONY2WncY..lr9tTe0e',
            }),
        };
        // @ts-ignore
        const userService = new UserService(userRepository, logger);
        const user = await userService.findById(1);

        expect(user.id).to.equal(1);
        expect(user.name).to.equal('Foo');
        expect(user.surname).to.equal('Bar');
        expect(user.email).to.equal('foo1@email.com');
    });


    describe('request to update a user given its properties and id', async () => {
        it('update password if given', async () => {
            const userRepository = {
                update: sinon.stub().resolves(1)
            };
            // @ts-ignore
            const userService = new UserService(userRepository, logger);
            await userService.update({
                id: 1,
                name: 'Foo',
                surname: 'Bar',
                password: '1234567',
            });

            const [[{ id, name, surname, password }]] = userRepository.update.args;

            expect(id).to.equal(1);
            expect(name).to.equal('Foo');
            expect(surname).to.equal('Bar');

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

        it('do not change password if omitted', async () => {
            const userRepository = {
                update: sinon.stub().resolves(1)
            };
            // @ts-ignore
            const userService = new UserService(userRepository, logger);
            const userId = await userService.update({
                id: 1,
                name: 'Foo',
                surname: 'Bar',
            });

            const [[{ id, name, surname, password }]] = userRepository.update.args;

            expect(userId).to.equal(1);

            expect(id).to.equal(1);
            expect(name).to.equal('Foo');
            expect(surname).to.equal('Bar');
            expect(password).to.equal(null);
        });
    });

    it('should request persistance layer to remove user', async () => {
        const userRepository = {
            delete: sinon.stub().resolves(1)
        };
        // @ts-ignore
        const userService = new UserService(userRepository, logger);

        const affectedRows = await userService.delete(4, 1);
        const [id] = userRepository.delete.firstCall.args;

        expect(affectedRows).to.equal(1);
        expect(id).to.equal(4);
    });

    it('should not allow the requester to remove itself', async () => {
        const userService = new UserService(null, logger);
        try {
            await userService.delete(4, 4);
            expect.fail();
        } catch (error) {
            expect(error.message).to.equal('Action forbidden');
        }
    });
});
