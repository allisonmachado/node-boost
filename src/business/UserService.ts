import { UserDataObject } from "../data-source/entities/user/UserDataObject";
import { UserRepository } from "../data-source/repositories/UserRepository";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async list(): Promise<UserDataObject[]> {
        return this.userRepository.findTop3();
    }
}