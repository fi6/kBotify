import { MessageType } from 'kaiheila-bot-root';
import { BotObject } from '../base/bot.object';
import { KBotify } from '../kbotify';

export class Channel extends BotObject {
    id: string;
    constructor(rawChannel: any, bot: KBotify) {
        super(bot);
        this.id = rawChannel.channelId;
    }
    get mention() {
        if (this.client.mentionWithSpace) return `(chn)${this.id}(chn) `;
        else return `(chn)${this.id}(chn)`;
    }
    sendMessage = (
        type: MessageType,
        content: string,
        quote?: string,
        tempTargetId?: string
    ) => {
        this.client.API.message.create(
            type,
            this.id,
            content,
            quote,
            tempTargetId
        );
    };
}
