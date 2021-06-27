import { EventEmitter } from 'events';
import { KBotify } from '.';

export class EventProcessor extends EventEmitter {
    client: KBotify | undefined;
    constructor(bot?: KBotify) {
        super();
        this.client = bot;
    }
    get _botInstance(): KBotify | undefined {
        return this.client;
    }
    process = (event: any, bot: KBotify) => {
        if (event.type !== 'systemMessage') return;
        const data = event.data;
        this.emit('system', data);
    };
}
