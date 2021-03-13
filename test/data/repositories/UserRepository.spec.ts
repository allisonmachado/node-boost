/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expect } from 'chai';
import { ILogger } from '../../../src/lib/ILogger';
import { EmptyLogger } from '../../../src/lib/EmptyLogger';
import { UserRepository } from '../../../src/data/repositories/UserRepository';

import sinon from 'sinon';

describe('User Repository', () => {
    const logger: ILogger = new EmptyLogger();
    const fakeUser = {
        id: 1,
        name: 'Foo',
        surname: 'Bar',
        email: 'baz@email.com',
        password: '123456',
    };

    describe('should abstract sql interactions with database', async () => {
        it('should create new users and retrieve his id', async () => {
            const insert = sinon.fake.resolves([777]);
            const knex = sinon.fake.returns({ insert });
            const connection = { getQueryBuilder: () => knex };
            // @ts-ignore
            const repository = new UserRepository(connection, logger);
            const userId = await repository.create('Foo', 'Bar', 'foobar@email.com', '123456');

            expect(knex.calledWith('user')).to.be.true;
            expect(userId).to.equal(777);
            expect(insert.calledWith({ name: 'Foo', surname: 'Bar', email: 'foobar@email.com', password: '123456' }));
        });

        it('should retrieve user by id', async () => {
            const where = sinon.fake.resolves([fakeUser]);
            const knex = sinon.fake.returns({ where });
            const connection = { getQueryBuilder: () => knex };
            // @ts-ignore
            const repository = new UserRepository(connection, logger);

            const user = (await repository.findById(1));

            expect(knex.calledWith('user')).to.be.true;
            expect(where.calledWith('id', 1)).to.be.true;
            expect(user.getId()).to.equal(1);
            expect(user.getName()).to.equal('Foo');
            expect(user.getSurname()).to.equal('Bar');
            expect(user.getEmail()).to.equal('baz@email.com');
            expect(user.getPassword()).to.equal('123456');
        });

        it('should retrieve user by email', async () => {
            const where = sinon.fake.resolves([fakeUser]);
            const knex = sinon.fake.returns({ where });
            const connection = { getQueryBuilder: () => knex };
            // @ts-ignore
            const repository = new UserRepository(connection, logger);

            const user = (await repository.findByEmail('baz@email.com'));

            expect(knex.calledWith('user')).to.be.true;
            expect(where.calledWith('email', 'baz@email.com')).to.be.true;
            expect(user.getId()).to.equal(1);
            expect(user.getName()).to.equal('Foo');
            expect(user.getSurname()).to.equal('Bar');
            expect(user.getEmail()).to.equal('baz@email.com');
            expect(user.getPassword()).to.equal('123456');
        });

        it('should retrieve retrieve first 10 users in database', async () => {
            const limit = sinon.fake.resolves([fakeUser]);
            const knex = sinon.fake.returns({ limit });
            const connection = { getQueryBuilder: () => knex };
            // @ts-ignore
            const repository = new UserRepository(connection, logger);
            const users = await repository.findTop10();

            expect(knex.calledWith('user')).to.be.true;
            expect(limit.calledWith(10)).to.be.true;
            expect(users.length).to.equal(1);

            const user = users.pop();
            expect(user.getId()).to.equal(1);
            expect(user.getName()).to.equal('Foo');
            expect(user.getSurname()).to.equal('Bar');
            expect(user.getEmail()).to.equal('baz@email.com');
            expect(user.getPassword()).to.equal('123456');
        });

        it('should delete existing users', async () => {
            const del = sinon.fake.resolves(1);
            const where = sinon.fake.returns({ del });
            const knex = sinon.fake.returns({ where });
            const connection = { getQueryBuilder: () => knex };
            // @ts-ignore
            const repository = new UserRepository(connection, logger);
            const affectedRows = await repository.delete(1);

            expect(knex.calledWith('user')).to.be.true;
            expect(where.calledWith('id', 1)).to.be.true;
            expect(affectedRows).to.equal(1);
        });

        describe('user update abstraction', async () => {
            it('should not issue any query if no parameters given', async () => {
                const update = sinon.fake();
                const where = sinon.fake.returns({ update });
                const knex = sinon.fake.returns({ where });
                const connection = { getQueryBuilder: () => knex };
                // @ts-ignore
                const repository = new UserRepository(connection, logger);

                const affectedRows = await repository.update(1);

                expect(affectedRows).to.equal(0);

                expect(update.callCount).to.equal(0);
                expect(where.callCount).to.equal(0);
                expect(knex.callCount).to.equal(0);
            });

            it('should update only name if desired', async () => {
                const update = sinon.fake.resolves(1);
                const where = sinon.fake.returns({ update });
                const knex = sinon.fake.returns({ where });
                const connection = { getQueryBuilder: () => knex };
                // @ts-ignore
                const repository = new UserRepository(connection, logger);

                const affectedRows = await repository.update(1, 'Son');

                expect(affectedRows).to.equal(1);

                expect(update.calledWith({ name: 'Son' })).to.be.true;
                expect(where.calledWith('id', 1)).to.be.true;
                expect(knex.calledWith('user')).to.be.true;
            });

            it('should update only surname if desired', async () => {
                const update = sinon.fake.resolves(1);
                const where = sinon.fake.returns({ update });
                const knex = sinon.fake.returns({ where });
                const connection = { getQueryBuilder: () => knex };
                // @ts-ignore
                const repository = new UserRepository(connection, logger);

                const affectedRows = await repository.update(1, '', 'Goku');

                expect(affectedRows).to.equal(1);

                expect(update.calledWith({ surname: 'Goku' })).to.be.true;
                expect(where.calledWith('id', 1)).to.be.true;
                expect(knex.calledWith('user')).to.be.true;
            });

            it('should update only password if desired', async () => {
                const update = sinon.fake.resolves(1);
                const where = sinon.fake.returns({ update });
                const knex = sinon.fake.returns({ where });
                const connection = { getQueryBuilder: () => knex };
                // @ts-ignore
                const repository = new UserRepository(connection, logger);

                const affectedRows = await repository.update(1, '', '', '12341234');

                expect(affectedRows).to.equal(1);

                expect(update.calledWith({ password: '12341234' })).to.be.true;
                expect(where.calledWith('id', 1)).to.be.true;
                expect(knex.calledWith('user')).to.be.true;
            });

            it('should update multiple properties if desired', async () => {
                const update = sinon.fake.resolves(1);
                const where = sinon.fake.returns({ update });
                const knex = sinon.fake.returns({ where });
                const connection = { getQueryBuilder: () => knex };
                // @ts-ignore
                const repository = new UserRepository(connection, logger);

                const affectedRows = await repository.update(1, 'Son', 'Goku', '12341234');

                expect(affectedRows).to.equal(1);

                expect(update.calledWith({ name: 'Son', surname: 'Goku', password: '12341234' })).to.be.true;
                expect(where.calledWith('id', 1)).to.be.true;
                expect(knex.calledWith('user')).to.be.true;
            });
        });
    });
});