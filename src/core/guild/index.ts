import { BotObject } from '../base/bot.object';
import { GuildCache } from '../cache';
import { KBotify } from '../kbotify';

export class Guild extends BotObject {
    id: string;
    constructor(id: string, bot: KBotify) {
        super(bot);
        this.id = id;
    }
}
