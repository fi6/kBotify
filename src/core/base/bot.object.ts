import { KBotify } from '../kbotify';

export abstract class BotObject {
    _botInstance: KBotify;
    constructor(bot: KBotify) {
        this._botInstance = bot;
    }
    getBotInstance = () => {
        return this._botInstance;
    };
}
