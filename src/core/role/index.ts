export abstract class Role {
    [key: string]: unknown;
    abstract id: string;
    abstract name: string;
    abstract guildId: string;

    abstract create(
        guildId: string,
        name: string,
        config?: unknown
    ): Promise<Role>;

    abstract view(): Promise<Role>;
    abstract update(config?: unknown): Promise<Role>;
    abstract delete(): Promise<void>;
}
