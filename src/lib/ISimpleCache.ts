export interface ISimpleCache<T> {
    search(key: string): T;
    save(key: string, data: T): void;
}
