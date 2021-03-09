import { ILogger } from "../../lib/ILogger";
import { Connection } from "../connection/mysql/Connection";
import { UserEntity } from "../entities/user/UserEntity";
import { IUserRepository } from "./IUserRepository";

import check from "check-types";
import Knex from "knex";

export class UserRepository implements IUserRepository {
    private knex: Knex;
    constructor(private connection: Connection, protected logger: ILogger) {
        this.knex = this.connection.getQueryBuilder();
        this.logger.debug(`initialized`);
    }

    public async create(name: string, surname: string, email: string, password: string): Promise<number> {
        const [ id ] = await this.knex("user").insert({ name, surname, email, password });
        return id;
    }

    public async findById(id: number): Promise<UserEntity> {
        const [ user ] = await this.knex("user").where("id", id);
        if (!user || check.emptyArray(user)) {
            return null;
        }
        return new UserEntity(user.id, user.name, user.surname, user.email, user.password);
    }

    public async findByEmail(email: string): Promise<UserEntity> {
        const [ user ] = await this.knex("user").where("email", email);
        if (!user || check.emptyArray(user)) {
            return null;
        }
        return new UserEntity(user.id, user.name, user.surname, user.email, user.password);
    }

    public async findTop10(): Promise<UserEntity[]> {
        const users = await this.knex("user").limit(10);
        return users.map((u: any) => new UserEntity(u.id, u.name, u.surname, u.email, u.password));
    }

    public async update(
        id: number, name: string = "", surname: string = "", password: string = "",
    ): Promise<number> {
        if (!name && !surname && !password) {
            return 0;
        }
        if (!id) {
            throw new Error(`Id is mandatory parameter for updating user record`);
        }
        let updateValues = {};
        if (name) {
            updateValues = {
                name,
            };
        }
        if (surname) {
            updateValues = {
                ...updateValues,
                surname,
            };
        }
        if (password) {
            updateValues = {
                ...updateValues,
                password,
            };
        }
        return await this.knex("user").where("id", id).update(updateValues);
    }

    public async delete(id: number): Promise<number> {
        return await this.knex("user").where("id", id).del();
    }
}
