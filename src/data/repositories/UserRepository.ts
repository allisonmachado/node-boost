import { Logger } from "../../Logger";
import { Connection } from "./mysql/Connection";
import { UserEntity } from "../entities/user/UserEntity";
import { RespositoryTemplate } from "./mysql/RepositoryTemplate";

export class UserRepository extends RespositoryTemplate {
    private readonly llogger = new Logger(UserRepository.name);

    constructor(connection: Connection) {
        super(connection);
        this.llogger.debug(`initialized`);
    }

    public async create(name, surname, email, password): Promise<number> {
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
}