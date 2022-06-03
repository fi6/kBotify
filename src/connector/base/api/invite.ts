import { BaseApi } from './base';

export abstract class InviteApi extends BaseApi {
    abstract list(
        guildId: string | undefined,
        channelId: string | undefined
    ): Promise<unknown>;

    abstract create(channelId: string, config?: unknown): Promise<unknown>;
    abstract delete(code: string): Promise<void>;
}
