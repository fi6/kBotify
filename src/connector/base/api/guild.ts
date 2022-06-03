import { Guild } from '../../../core/guild';
import { BaseApi } from './base';

export abstract class GuildApi extends BaseApi {
    abstract create(name: string, configs?: unknown): Promise<Guild>;
    abstract view(channelId: string): Promise<Guild>;
    abstract update(channelId: string, configs: unknown): Promise<Guild>;
    abstract delete(channelId: string): void;
}
