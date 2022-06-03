import { EventEmitter } from 'bunyan';
import { BaseConnector } from '..';
import { KBotify } from '../../../core/kbotify';
import { kBotifyLogger } from '../../../core/logger';
import { TextMessage, ButtonEventMessage } from '../../../core/message';

// eslint-disable-next-line no-redeclare
export class EventProcessor extends EventEmitter {
    client;
    constructor(bot: BaseConnector) {
        super();
        this.client = bot;
    }

    process = (result: any, client: KBotify) => {
        const data = result.data;
        switch (result.type) {
            case 'textMessage':
            case 'kmarkdownMessage': {
                const message = new TextMessage(data, client);
                const userCollectors = this.client.collectors.user;
                const collector = userCollectors.get(message.authorId);
                try {
                    if (collector) {
                        collector.add(message);
                    }
                } catch (error) {
                    kBotifyLogger.error(error);
                }
                this.emit('text', message);

                // if (userCollectors.collecting(message.authorId)) {
                //     userCollectors.get(message.authorId).add(message);
                // }
                return;
            }
            case 'systemMessage':
                if (data.type === 'buttonClick') {
                    this.emit(
                        'buttonEvent',
                        new ButtonEventMessage(data, client)
                    );

                    return;
                }
                break;
            default:
                break;
        }
    };
}
