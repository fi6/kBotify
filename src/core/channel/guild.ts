import {
    MessageType,
    UserInGuildNonStandard,
    Channel as rawChannel,
} from 'kaiheila-bot-root';
import { BaseObject } from '../base/bot.object';
import { KBotify } from '../kbotify';

export class GuildChannel extends BaseObject implements Partial<rawChannel> {
    [key: string]: unknown;
    id: string;

    type?: number;
    name?: string;
    masterId?: string;
    guildId?: string;
    topic?: string;
    isCategory?: boolean;
    parentId?: string;
    level?: number;
    slowMode?: number;
    permissionOverwrites?: { roldId: number; allow: number; deny: number }[];
    permissionUsers?: {
        allow: number;
        deny: number;
        user: UserInGuildNonStandard;
    }[];

    permissionSync?: number;
    serverUrl?: string | undefined;
    private readonly invite: string | undefined = undefined;

    constructor(
        rawChannelObject: Partial<rawChannel> & {
            id: string;
        },
        client: KBotify
    ) {
        super(client);
        this.client = client;
        this.id = rawChannelObject.id;
        const raw = rawChannelObject as Partial<rawChannel> & {
            [key: string]: unknown;
        };
        for (const prop in rawChannelObject) {
            this[prop] = raw[prop] !== undefined ? raw[prop] : this[prop];
        }
    }

    get mention(): string {
        return `(chn)${this.id}(chn)`;
    }

    static fromRaw = (
        rawChannelObject: rawChannel,
        client: KBotify
    ): Required<GuildChannel> => {
        return new GuildChannel(
            rawChannelObject,
            client
        ) as Required<GuildChannel>;
    };

    full = async (): Promise<Required<GuildChannel>> => {
        const rawChannel = await this.client.API.channel.view(this.id);

        return new GuildChannel(
            rawChannel,
            this.client
        ) as Required<GuildChannel>;
    };

    sendMessage = async (
        type: MessageType,
        content: string,
        quote?: string,
        tempTargetId?: string
    ) => {
        return this.client.API.message.create(
            type,
            this.id,
            content,
            quote,
            tempTargetId
        );
    };

    getInvite = async (): Promise<string> => {
        if (this.invite) {
            return this.invite;
        }
        const result = await this.client.API.invite.create(undefined, this.id);

        return result.url;
    };
}
