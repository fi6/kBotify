import {
    KMarkdownMessage as Kmd,
    MessageType,
    TextMessage as Text,
    User,
    UserInGuild,
} from 'kaiheila-bot-root';
import { BaseConnector } from '../../connector/base';
import { KBotify } from '../kbotify';

export class TextMessage {
    type: MessageType.kMarkdown | MessageType.text;
    author: User & UserInGuild;
    mention: {
        user: string[];
        roles: string[];
        all: boolean;
        here: boolean;
        channels?: string[];
    };
    // | {
    //       user: string[];
    //       roles: string[];
    //       all: boolean;
    //       here: boolean;
    //   };

    channelName?: string;
    content: string;
    code: string;
    msgId: string;
    msgTimestamp: number;
    channelId: string;
    guildId?: string;
    channelType: string;
    authorId: string;
    client: BaseConnector;

    /**
     * Transfer message info class
     *
     * @param rawMessage TextMessageInterface, from kaiheila-bot-root
     * @param client
     */
    constructor(rawMessage: Kmd | Text, client: BaseConnector) {
        this.type = rawMessage.type;
        this.author = rawMessage.author;
        this.authorId = rawMessage.authorId;
        this.mention = rawMessage.mention;
        this.channelName = rawMessage.channelName;
        this.content = rawMessage.content;
        this.code = rawMessage.code;
        this.msgId = rawMessage.msgId;
        this.msgTimestamp = rawMessage.msgTimestamp;
        this.channelId = rawMessage.channelId;
        this.guildId = rawMessage.guildId;
        this.channelType = rawMessage.channelType;
        this.client = client;
    }

    async delete(): Promise<void> {
        return this.client.Api.message.delete(this.msgId);
    }

    async update(content: string, config: unknown): Promise<void> {
        await this.client.Api.message.update(this.msgId, content, config);

        return;
    }
}
