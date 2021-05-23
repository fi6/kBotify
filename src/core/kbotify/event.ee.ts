import { EventEmitter } from 'events';
import { KBotify } from '.';

export class EventProcessor extends EventEmitter {
    _botInstance;
    constructor(bot?: KBotify) {
        super();
        this._botInstance = bot;
    }
    process = (event: any, bot: KBotify) => {
        if (event.type !== 'systemMessage') return;
        const data = event.data;
        this.emit('system', data);
    };
}
