import {
    MessageType,
    UserInGuildNonStandard,
    Channel as rawChannel,
} from 'kaiheila-bot-root';
import { BaseObject } from '../base/bot.object';
import { KBotify } from '../kbotify';

export class PrivateChannel extends BaseObject implements Partial<rawChannel> {
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
        if (this.client.mentionWithSpace) {
            return `(chn)${this.id}(chn) `;
        } else {
            return `(chn)${this.id}(chn)`;
        }
    }

    static fromRaw = (
        rawChannelObject: rawChannel,
        client: KBotify
    ): Required<PrivateChannel> => {
        return new PrivateChannel(
            rawChannelObject,
            client
        ) as Required<PrivateChannel>;
    };

    full = async (): Promise<Required<PrivateChannel>> => {
        const rawChannel = await this.client.Api.channel.view(this.id);

        return new PrivateChannel(
            rawChannel,
            this.client
        ) as Required<PrivateChannel>;
    };

    sendMessage = async (
        type: MessageType,
        content: string,
        quote?: string
    ) => {
        return this.client.Api.directMessage.create(
            type,
            this.id,
            undefined,
            content,
            quote
        );
    };
}
