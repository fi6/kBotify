import { BaseConnector } from '../../connector/base';

export abstract class BaseObject {
    client: BaseConnector;
    constructor(client: BaseConnector) {
        this.client = client;
    }

    /**
     *
     * @deprecated
     * @readonly
     * @type {KBotify}
     * @memberof BaseObject
     */
    get _botInstance(): BaseConnector {
        return this.client;
    }

    getBotInstance = (): BaseConnector => {
        return this.client;
    };
}
