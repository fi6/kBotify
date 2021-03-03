import { MessageType } from 'kaiheila-bot-root';
import { BotObject } from '../base/bot.object';
import { KBotify } from '../kbotify';

export class Channel extends BotObject {
    id: string;
    constructor(rawChannel: any, bot: KBotify) {
        super(bot);
        this.id = rawChannel.channelId;
    }
    sendMessage = (
        type: MessageType,
        content: string,
        quote?: string,
        tempTargetId?: string
    ) => {
        this._botInstance.API.message.create(
            type,
            this.id,
            content,
            quote,
            tempTargetId
        );
    };
}
