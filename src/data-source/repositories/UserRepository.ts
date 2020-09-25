import { UserDataObject } from "../entities/user/UserDataObject";

export class UserRepository {
    
    public async findTop3(): Promise<UserDataObject[]> {
        return [
            new UserDataObject(1, "Foo Bar"),
            new UserDataObject(2, "Bar Foo"),
            new UserDataObject(3, "Baz Bar"),
        ]
    }
}