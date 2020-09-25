import { UserRepository } from "../data-source/repositories/UserRepository";
import { Logger } from "../Logger";

export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.logger.debug(`initialized`);
    }

    public async list(): Promise<Array<{ name: string, surname: string, email: string }>> {
        const users = await this.userRepository.findTop10();
        return users.map(u => ({
            name: u.getName(),
            surname: u.getSurname(),
            email: u.getEmail(),
        }));
    }
}