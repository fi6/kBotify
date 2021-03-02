import {
    KMarkdownMessage as Kmd,
    MessageType,
    TextMessage as Text,
    User,
    UserInGuildNonStandard,
} from 'kaiheila-bot-root';
import { KBotify } from '../kbotify';

export class TextMessage {
    type: MessageType.kMarkdown | MessageType.text;
    author: User;
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
    guildId?: string | undefined;
    channelType: string;
    authorId: string;
    botInstance: KBotify;

    /**
     * Transfer message info class
     *
     * @param messageObject TextMessageInterface, from kaiheila-bot-root
     * @param bot
     */
    constructor(messageObject: Kmd | Text, bot: KBotify) {
        this.type = messageObject.type;
        this.author = (messageObject.author as unknown) as User;
        this.authorId = messageObject.authorId;
        this.mention = messageObject.mention;
        this.channelName = messageObject.channelName;
        this.content = messageObject.content;
        this.code = messageObject.code;
        this.msgId = messageObject.msgId;
        this.msgTimestamp = messageObject.msgTimestamp;
        this.channelId = messageObject.channelId;
        this.guildId = messageObject.guildId;
        this.channelType = messageObject.channelType;
        this.botInstance = bot;
    }
}
