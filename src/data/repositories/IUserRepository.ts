import { UserEntity } from "../entities/user/UserEntity";

export interface IUserRepository {
    create(name: string, surname: string, email: string, password: string): Promise<number>;
    findById(id: number): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity>;
    findTop10(): Promise<UserEntity[]>;
    update(id: string, name: string, surname: string, password: string): Promise<number>;
    delete(id: number): Promise<number>;
}