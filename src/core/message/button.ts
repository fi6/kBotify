import { ButtonClickEvent, UserInGuild } from 'kaiheila-bot-root';
import { KBotify } from '../kbotify';
import { BaseUser } from '../user';

export class ButtonEventMessage implements Partial<ButtonClickEvent> {
    msgId: string;
    msgTimestamp: number;
    static type = 'buttonClick';
    channelType: string;
    guildId?: string;
    channelId: string;
    targetMsgId: string;
    content: string;
    userId: string;
    user: BaseUser;
    _botInstance: KBotify;
    constructor(rawEvent: ButtonClickEvent, bot: KBotify) {
        this.msgId = rawEvent.msgId;
        this.msgTimestamp = rawEvent.msgTimestamp;
        this.channelType = rawEvent.channelType;
        this.guildId = rawEvent.guildId;
        this.channelId = rawEvent.channelId;
        this.targetMsgId = rawEvent.targetMsgId;
        this.content = rawEvent.value;
        this.userId = rawEvent.userId;
        this.user = new BaseUser(rawEvent.user as any, bot);
        this._botInstance = bot;
    }
}
