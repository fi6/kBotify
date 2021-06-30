import { API as rawAPI } from 'kaiheila-bot-root/dist/api';
import { ChannelAPI as rawChannelAPI } from 'kaiheila-bot-root/dist/api/channel';
import { BotInstance } from 'kaiheila-bot-root/dist/BotInstance';
import { KHAPIResponse } from 'kaiheila-bot-root/dist/types/kaiheila/api';
import { KHChannel } from 'kaiheila-bot-root/dist/types/kaiheila/common';
import RequestError from 'kaiheila-bot-root/dist/models/Error/RequestError';
import { transformChannel } from 'kaiheila-bot-root/dist/helper/transformer/channel';
import { ChannelListResponseInternal } from 'kaiheila-bot-root/dist/api/channel/channel.types';
import { KBotify } from '.';
import { Channel } from '../channel';

export class API extends rawAPI {
    channel: ChannelAPI;
    constructor(client: KBotify) {
        super(client);
        this.channel = new ChannelAPI(client);
    }
}

class ChannelAPI extends rawChannelAPI {
    private client: KBotify;
    constructor(client: KBotify) {
        super(client);
        this.client = client;
    }
    async create(
        guildId: string,
        name: string,
        type?: string,
        parentId?: string,
        limitAmount?: number,
        voiceQuality?: number
    ): Promise<Required<Channel>> {
        super.create(guildId, name, type, parentId, limitAmount, voiceQuality);
        const data = (
            await this.client.post('v3/channel/create', {
                guild_id: guildId,
                name,
                type,
                parent_id: parentId,
                limit_amount: limitAmount,
                voice_quality: voiceQuality,
            })
        ).data as KHAPIResponse<KHChannel>;
        if (data.code === 0) {
            return new Channel(
                transformChannel(data.data),
                this.client
            ) as Required<Channel>;
        } else {
            throw new RequestError(data.code, data.message);
        }
    }
    async view(channelId: string): Promise<Required<Channel>> {
        const raw = await super.view(channelId);
        return new Channel(raw, this.client) as Required<Channel>;
    }
    async list(guildId: string): Promise<ChannelListResponse> {
        const raw = await super.list(guildId);
        raw.items = raw.items.map((c) => Channel.fromRaw(c, this.client));
        return raw as ChannelListResponse;
    }
}

type ChannelListResponse = Omit<ChannelListResponseInternal, 'items'> & {
    items: Required<Channel>[];
};
