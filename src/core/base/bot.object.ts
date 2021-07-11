import { KBotify } from '../kbotify';

export abstract class BaseObject {
    client: KBotify;
    constructor(client: KBotify) {
        this.client = client;
    }

    /**
     *
     * @deprecated
     * @readonly
     * @type {KBotify}
     * @memberof BaseObject
     */
    get _botInstance(): KBotify {
        return this.client;
    }

    getBotInstance = (): KBotify => {
        return this.client;
    };
}
