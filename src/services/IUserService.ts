import { User } from '../data/entities/User';

export interface IUserService {
    create(user: Omit<User, 'id'>): Promise<number>;
    list(): Promise<Omit<User, 'password'>[]>;
    findById(id: number): Promise<Omit<User, 'password'>>;
    update(user: Partial<Omit<User, 'email'>>): Promise<number>;
    delete(id: number, requesterId: number): Promise<number>;
}
