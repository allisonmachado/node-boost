import { UserRepository } from "../data/repositories/UserRepository";
import { UserEntity } from "../data/entities/user/UserEntity";
import { Logger } from "../Logger";

export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.logger.debug(`initialized`);
    }

    public async create(name: string, surname: string, email: string, password: string): Promise<number> {
        return this.userRepository.create(name, surname, email, password);
    }

    public async list(): Promise<UserAccessibleProps[]> {
        const users = await this.userRepository.findTop10();
        return this.visiblePropsMapper(users);
    }

    public async findById(id: number): Promise<UserAccessibleProps> {
        const users = await this.userRepository.findById(id);
        return this.visiblePropsMapper(users)[0];
    }

    public async update(id: string, name: string, surname: string, password: string): Promise<number> {
        return this.userRepository.update(id, name, surname, password);
    }

    public async delete(id: number): Promise<number> {
        return this.userRepository.delete(id);
    }

    private visiblePropsMapper(users: UserEntity[]): UserAccessibleProps[] {
        return users.map(u => ({
            name: u.getName(),
            surname: u.getSurname(),
            email: u.getEmail(),
        }));
    }
}

interface UserAccessibleProps {
    name: string;
    surname: string;
    email: string;
}