import { API as rawAPI } from 'kaiheila-bot-root/dist/api';
import { ChannelAPI as rawChannelAPI } from 'kaiheila-bot-root/dist/api/channel';
import { BotInstance } from 'kaiheila-bot-root/dist/BotInstance';
import { KHAPIResponse } from 'kaiheila-bot-root/dist/types/kaiheila/api';
import { KHChannel } from 'kaiheila-bot-root/dist/types/kaiheila/common';
import RequestError from 'kaiheila-bot-root/dist/models/Error/RequestError';
import { transformChannel } from 'kaiheila-bot-root/dist/helper/transformer/channel';
import { ChannelListResponseInternal } from 'kaiheila-bot-root/dist/api/channel/channel.types';
import { Channel } from '../channel';
import { KBotify } from '.';

export class API extends rawAPI {
    channel: ChannelAPI;
    constructor(client: KBotify) {
        super(client);
        this.channel = new ChannelAPI(client);
    }
}

class ChannelAPI extends rawChannelAPI {
    private readonly client: KBotify;
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
        const raw = await super.create(
            guildId,
            name,
            type,
            parentId,
            limitAmount,
            voiceQuality
        );

        return Channel.fromRaw(raw, this.client);
    }

    async view(channelId: string): Promise<Required<Channel>> {
        // const raw = await super.view(channelId);
        let raw;
        const data = (
            await this.client.get('v3/channel/view', {
                target_id: channelId
            })
        ).data as KHAPIResponse<KHChannel>;
        if (data.code === 0) {
            raw = transformChannel(data.data);
        } else {
            throw new RequestError(data.code, data.message);
        }

        return new Channel(raw, this.client) as Required<Channel>;
    }

    async list(guildId: string): Promise<ChannelListResponse> {
        const raw = await super.list(guildId);
        raw.items = raw.items.map((c) => {
            return Channel.fromRaw(c, this.client);
        });

        return raw as ChannelListResponse;
    }
}

type ChannelListResponse = Omit<ChannelListResponseInternal, 'items'> & {
    items: Required<Channel>[];
};
