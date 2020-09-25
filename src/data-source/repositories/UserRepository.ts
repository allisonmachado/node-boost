import { Logger } from "../../Logger";
import { Connection } from "../mysql/Connection";
import { UserEntity } from "../entities/user/UserEntity";
import { RespositoryTemplate } from "../mysql/RepositoryTemplate";

export class UserRepository extends RespositoryTemplate {
    private readonly llogger = new Logger(UserRepository.name);

    constructor(connection: Connection) {
        super(connection);
        this.llogger.debug(`initialized`);
    }

    public async findTop10(): Promise<UserEntity[]> {
        const data = await this.query("SELECT * FROM simple_db.user LIMIT 10");
        return data.map((d: any) => new UserEntity(d.id, d.name, d.surname, d.email, d.password));
    }
}