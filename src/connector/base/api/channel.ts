import { ChannelTypes, GuildChannel } from '../../../core/channel';
import { BaseApi } from './base';

export abstract class ChannelApi extends BaseApi {
    abstract create(
        guildId: string,
        name: string,
        type: ChannelTypes | string,
        configs?: unknown
    ): GuildChannel;

    abstract list(guildId: string): GuildChannel[];

    abstract view(channelId: string): GuildChannel;
    abstract update(channelId: string, configs: unknown): GuildChannel;
    abstract delete(channelId: string): void;
}
