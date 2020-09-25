export class UserEntity {
    constructor(
        private id: number,
        private name: string,
        private surname: string,
        private email: string,
        private password: string,
    ) {}

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getSurname(): string {
        return this.surname;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }
}