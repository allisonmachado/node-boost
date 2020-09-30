import { Logger } from "../../Logger";
import { Connection } from "./mysql/Connection";
import { UserEntity } from "../entities/user/UserEntity";
import { RespositoryTemplate } from "./mysql/RepositoryTemplate";
import { CheckTypes } from "../../CheckTypes";

export class UserRepository extends RespositoryTemplate {
    private readonly llogger = new Logger(UserRepository.name);

    constructor(connection: Connection) {
        super(connection);
        this.llogger.debug(`initialized`);
    }

    public async create(name: string, surname: string, email: string, password: string): Promise<number> {
        const sql = "INSERT INTO `simple_db`.`user` (`name`, `surname`, `email`, `password`) "
            + "VALUES (?, ?, ?, ?)";
        const data = await this.query(sql, [name, surname, email, password]);
        return data.insertId;
    }

    public async findById(id: number): Promise<UserEntity[]> {
        const data = await this.query("SELECT * FROM simple_db.user WHERE id = ?", [id]);
        return data.map((d: any) => new UserEntity(d.id, d.name, d.surname, d.email, d.password));
    }

    public async findTop10(): Promise<UserEntity[]> {
        const data = await this.query("SELECT * FROM simple_db.user LIMIT 10");
        return data.map((d: any) => new UserEntity(d.id, d.name, d.surname, d.email, d.password));
    }

    public async update(id: string, name: string = "", surname: string = "", password: string = ""): Promise<number> {
        if (!CheckTypes.hasContent(name) && !CheckTypes.hasContent(surname) && !CheckTypes.hasContent(password)) {
            return;
        }
        if (CheckTypes.isNullOrUndefined(id)) {
            throw new Error(`Id is mandatory parameter for updating user record`);
        }
        const columnsToUpdate = [];
        const valuesToUpdate = [];
        if (CheckTypes.hasContent(name)) {
            columnsToUpdate.push("`name` = ?");
            valuesToUpdate.push(name);
        }
        if (CheckTypes.hasContent(surname)) {
            columnsToUpdate.push("`surname` = ?");
            valuesToUpdate.push(surname);
        }
        if (CheckTypes.hasContent(password)) {
            columnsToUpdate.push("`password` = ?");
            valuesToUpdate.push(password);
        }
        const sql = "UPDATE `simple_db`.`user` SET "
            + columnsToUpdate.join(", ")
            + " WHERE (`id` = ?)";
        valuesToUpdate.push(id);
        const result = await this.query(sql, valuesToUpdate);
        return result.affectedRows;
    }

    public async delete(id: number): Promise<number> {
        const result = await this.query("DELETE FROM `simple_db`.`user` WHERE (`id` = ?)", [id]);
        return result.affectedRows;
    }
}