import { ButtonClickEvent } from 'kaiheila-bot-root';
import { EventEmitter } from 'events';
import { KBotify } from '.';
import { ButtonEventMessage, TextMessage } from '../message';
import { MessageEmissions } from './types';

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

export class MessageProcessor extends EventEmitter {
    client;
    constructor(bot: KBotify) {
        super();
        this.client = bot;
    }
    process = (result: any, bot: KBotify) => {
        const data = result.data;
        switch (result.type) {
            case 'textMessage':
            case 'kmarkdownMessage': {
                const message = new TextMessage(data, bot);
                const userCollectors = this.client.collectors.user;
                const collector = userCollectors.get(message.authorId);
                try {
                    if (collector) collector.add(message);
                } catch (error) {
                    console.error(error);
                }
                this.emit('text', message);
                // if (userCollectors.collecting(message.authorId)) {
                //     userCollectors.get(message.authorId).add(message);
                // }
                return;
            }
            case 'systemMessage':
                if (data.type === 'buttonClick') {
                    this.emit('buttonEvent', new ButtonEventMessage(data, bot));
                    return;
                }
                break;
            default:
                break;
        }
    };
}
