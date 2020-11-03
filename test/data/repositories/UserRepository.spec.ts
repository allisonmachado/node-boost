// tslint:disable: only-arrow-functions
import { expect } from "chai";
import { ILogger } from "../../../src/lib/ILogger";
import { EmptyLogger } from "../../../src/lib/EmptyLogger";
import { UserRepository } from "../../../src/data/repositories/UserRepository";

import sinon from "sinon";

describe("User Repository", () => {
    const logger: ILogger = new EmptyLogger();

    describe("should abstract sql interactions with database", async () => {
        it("should create new users", async () => {
            const repository = new UserRepository(null, logger);
            const stub = sinon.stub(repository, 'query').resolves({ insertId: 1 });

            const userId = await repository.create("Foo", "Bar", "foobar@email.com", "123456");

            const firstArgs = stub.firstCall.args[0];
            const secondArgs = stub.firstCall.args[1];

            expect(userId).to.equal(1);

            expect(firstArgs).to.equal(
                'INSERT INTO `simple_db`.`user` (`name`, `surname`, `email`, `password`) VALUES (?, ?, ?, ?)'
            );
            expect(secondArgs).to.deep.equal(
                ['Foo', 'Bar', 'foobar@email.com', '123456']
            );
        });

        it("should retrieve user by id", async () => {
            const repository = new UserRepository(null, logger);
            const stub = sinon.stub(repository, 'query').resolves([{
                id: 1,
                name: "Foo",
                surname: "Bar",
                email: "baz@email.com",
                password: "123456",
            }]);

            const user = (await repository.findById(1));

            const firstArgs = stub.firstCall.args[0];
            const secondArgs = stub.firstCall.args[1];

            expect(user.getId()).to.equal(1);
            expect(user.getName()).to.equal("Foo");
            expect(user.getSurname()).to.equal("Bar");
            expect(user.getEmail()).to.equal("baz@email.com");
            expect(user.getPassword()).to.equal("123456");

            expect(firstArgs).to.equal(
                'SELECT * FROM simple_db.user WHERE id = ?'
            );
            expect(secondArgs).to.deep.equal(
                [1]
            );
        });

        it("should retrieve user by email", async () => {
            const repository = new UserRepository(null, logger);
            const stub = sinon.stub(repository, 'query').resolves([{
                id: 1,
                name: "Foo",
                surname: "Bar",
                email: "baz@email.com",
                password: "123456",
            }]);

            const user = (await repository.findByEmail("baz@email.com"));

            const firstArgs = stub.firstCall.args[0];
            const secondArgs = stub.firstCall.args[1];

            expect(user.getId()).to.equal(1);
            expect(user.getName()).to.equal("Foo");
            expect(user.getSurname()).to.equal("Bar");
            expect(user.getEmail()).to.equal("baz@email.com");
            expect(user.getPassword()).to.equal("123456");

            expect(firstArgs).to.equal(
                'SELECT * FROM simple_db.user WHERE email = ?'
            );
            expect(secondArgs).to.deep.equal(
                ["baz@email.com"]
            );
        });

        it("should retrieve retrieve first 10 users in database", async () => {
            const repository = new UserRepository(null, logger);
            const stub = sinon.stub(repository, 'query').resolves([
                { id: 1, name: "Foo", surname: "Bar", email: "baz@email.com", password: "123456" },
                { id: 2, name: "Baz", surname: "Nemo", email: "nemo@email.com", password: "123456" }
            ]);

            const users = (await repository.findTop10());

            const firstArgs = stub.firstCall.args[0];

            expect(users.length).to.equal(2);

            expect(firstArgs).to.equal(
                'SELECT * FROM simple_db.user LIMIT 10'
            );
        });

        it("should delete existing users", async () => {
            const repository = new UserRepository(null, logger);
            const stub = sinon.stub(repository, 'query').resolves({ affectedRows: 1 });

            const affectedRows = await repository.delete(1);

            const firstArgs = stub.firstCall.args[0];
            const secondArgs = stub.firstCall.args[1];

            expect(affectedRows).to.equal(1);

            expect(firstArgs).to.equal(
                'DELETE FROM `simple_db`.`user` WHERE (`id` = ?)'
            );
            expect(secondArgs).to.deep.equal(
                [1]
            );
        });

        describe("user update abstraction", async () => {
            it("should not issue any query if no parameters given", async () => {
                const repository = new UserRepository(null, logger);
                const stub = sinon.stub(repository, 'query').resolves({ affectedRows: 0 });

                const affectedRows = await repository.update(1);

                expect(affectedRows).to.equal(0);

                expect(stub.callCount).to.equal(0);
            });

            it("should update only name if desired", async () => {
                const repository = new UserRepository(null, logger);
                const stub = sinon.stub(repository, 'query').resolves({ affectedRows: 1 });

                const affectedRows = await repository.update(1, "Bazz");

                const firstArgs = stub.firstCall.args[0];
                const secondArgs = stub.firstCall.args[1];

                expect(affectedRows).to.equal(1);

                expect(firstArgs).to.equal(
                    'UPDATE `simple_db`.`user` SET `name` = ? WHERE (`id` = ?)'
                );
                expect(secondArgs).to.deep.equal(
                    [ 'Bazz', 1 ]
                );
            });

            it("should update only surname if desired", async () => {
                const repository = new UserRepository(null, logger);
                const stub = sinon.stub(repository, 'query').resolves({ affectedRows: 1 });

                const affectedRows = await repository.update(1, "Bazz");

                const firstArgs = stub.firstCall.args[0];
                const secondArgs = stub.firstCall.args[1];

                expect(affectedRows).to.equal(1);

                expect(firstArgs).to.equal(
                    'UPDATE `simple_db`.`user` SET `name` = ? WHERE (`id` = ?)'
                );
                expect(secondArgs).to.deep.equal(
                    [ 'Bazz', 1 ]
                );
            });

            it("should update only surname if desired", async () => {
                const repository = new UserRepository(null, logger);
                const stub = sinon.stub(repository, 'query').resolves({ affectedRows: 1 });

                const affectedRows = await repository.update(1, "", "Rocket");

                const firstArgs = stub.firstCall.args[0];
                const secondArgs = stub.firstCall.args[1];

                expect(affectedRows).to.equal(1);

                expect(firstArgs).to.equal(
                    'UPDATE `simple_db`.`user` SET `surname` = ? WHERE (`id` = ?)'
                );
                expect(secondArgs).to.deep.equal(
                    [ 'Rocket', 1 ]
                );
            });

            it("should update only password if desired", async () => {
                const repository = new UserRepository(null, logger);
                const stub = sinon.stub(repository, 'query').resolves({ affectedRows: 1 });

                const affectedRows = await repository.update(1, "", "", "chmod777");

                const firstArgs = stub.firstCall.args[0];
                const secondArgs = stub.firstCall.args[1];

                expect(affectedRows).to.equal(1);

                expect(firstArgs).to.equal(
                    'UPDATE `simple_db`.`user` SET `password` = ? WHERE (`id` = ?)'
                );
                expect(secondArgs).to.deep.equal(
                    [ 'chmod777', 1 ]
                );
            });

            it("should update multiple properties if desired", async () => {
                const repository = new UserRepository(null, logger);
                const stub = sinon.stub(repository, 'query').resolves({ affectedRows: 1 });

                const affectedRows = await repository.update(1, "Bazz", "Rocket", "chmod777");

                const firstArgs = stub.firstCall.args[0];
                const secondArgs = stub.firstCall.args[1];

                expect(affectedRows).to.equal(1);

                expect(firstArgs).to.equal(
                    'UPDATE `simple_db`.`user` SET `name` = ?, `surname` = ?, `password` = ? WHERE (`id` = ?)'
                );
                expect(secondArgs).to.deep.equal(
                    [ 'Bazz', 'Rocket', 'chmod777', 1 ]
                );
            });
        });
    });
});