import EventEmitter from 'events';
import { TextMessage } from '../message';

export class CollectorManager {
    user: UserCollectorManager = new UserCollectorManager();
}

class UserCollectorManager {
    #collectors: Map<string, Collector> = new Map();
    create = (userId: string, timeout: number = 6e4) => {
        const collector = new Collector(this, userId);
        this.#collectors.set(userId, collector);
        setTimeout(() => {
            this.remove(userId);
        }, timeout);
        return collector;
    };
    get = (userId: string) => {
        return this.#collectors.get(userId);
    };
    remove = (userId: string) => {
        this.#collectors.get(userId)?.emit('stop');
        this.#collectors.delete(userId);
    };
    collecting(userId: string) {
        return this.#collectors.has(userId);
    }
}

class Collector extends EventEmitter {
    manager: UserCollectorManager;
    messages: TextMessage[] = [];
    #id: string;
    constructor(manager: UserCollectorManager, id: string) {
        super();
        this.manager = manager;
        this.#id = id;
    }

    add = (message: TextMessage) => {
        this.messages.push(message);
        this.emit('message', message);
    };
    stop = () => {
        this.manager.remove(this.#id);
    };
}
