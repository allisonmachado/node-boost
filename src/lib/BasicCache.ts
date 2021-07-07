export interface BasicCache<T> {
    search(key: string): T;
    save(key: string, data: T): void;
}
