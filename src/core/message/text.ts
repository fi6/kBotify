import {
    KMarkdownMessage as Kmd,
    MessageType,
    TextMessage as Text,
    User,
    UserInGuild,
    UserInGuildNonStandard,
} from 'kaiheila-bot-root';
import { KBotify } from '../kbotify';

export class TextMessage {
    type: MessageType.kMarkdown | MessageType.text;
    author: User & UserInGuild;
    mention:
        | {
              user: string[];
              roles: string[];
              all: boolean;
              here: boolean;
              channels: string[];
          }
        | {
              user: string[];
              roles: string[];
              all: boolean;
              here: boolean;
          };
    channelName?: string;
    content: string;
    code: string;
    msgId: string;
    msgTimestamp: number;
    channelId: string;
    guildId?: string;
    channelType: string;
    authorId: string;
    _botInstance: KBotify;

    /**
     * Transfer message info class
     *
     * @param rawMessage TextMessageInterface, from kaiheila-bot-root
     * @param bot
     */
    constructor(rawMessage: Kmd | Text, bot: KBotify) {
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
        this._botInstance = bot;
    }
}
