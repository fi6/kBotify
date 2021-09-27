import { EventEmitter } from 'events';
import { ButtonEventMessage, TextMessage } from '../message';
import { kBotifyLogger } from '../logger';
import { MessageEmissions } from './types';
import { KBotify } from '.';

export declare interface MessageProcessor {
    on<K extends keyof MessageEmissions>(
        event: K,
        listener: MessageEmissions[K]
    ): this;

    emit<K extends keyof MessageEmissions>(
        event: K,
        ...args: Parameters<MessageEmissions[K]>
    ): boolean;

    off<K extends keyof MessageEmissions>(
        event: K,
        listener: MessageEmissions[K]
    ): this;
}

// eslint-disable-next-line no-redeclare
export class MessageProcessor extends EventEmitter {
    client;
    constructor(bot: KBotify) {
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
