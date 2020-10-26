export interface IUserService {
    create(name: string, surname: string, email: string, password: string): Promise<number>;
    list(): Promise<UserAccessibleProps[]>;
    findById(id: number): Promise<UserAccessibleProps>;
    update(id: string, name: string, surname: string, password: string): Promise<number>;
    delete(id: number): Promise<number>;
}

export interface UserAccessibleProps {
    id: number,
    name: string;
    surname: string;
    email: string;
}