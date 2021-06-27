import { KBotify } from '../kbotify';

export abstract class BotObject {
    client: KBotify;
    constructor(bot: KBotify) {
        this.client = bot;
    }
    /**
     *
     * @deprecated
     * @readonly
     * @type {KBotify}
     * @memberof BotObject
     */
    get _botInstance(): KBotify {
        return this.client;
    }
    getBotInstance = (): KBotify => {
        return this.client;
    };
}
