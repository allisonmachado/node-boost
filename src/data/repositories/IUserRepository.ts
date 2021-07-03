import { User } from '../entities/User';

export interface IUserRepository {
    create(user: Omit<User, 'id'>): Promise<number>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findTop10(): Promise<User[]>;
    update(user: Omit<User, 'email'>): Promise<number>;
    delete(id: number): Promise<number>;
}
