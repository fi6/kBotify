import LRUCache from 'lru-cache';
import { BaseObject } from '../base/bot.object';
import { KBotify } from '../kbotify';
import { GuildCache } from './cache.guild';

const options = { max: 64, maxAge: 30 * 6e4 };

export class CacheManager extends BaseObject {
    #guildCache: LRUCache<string, GuildCache>;

    constructor(bot: KBotify) {
        super(bot);
        this.#guildCache = new LRUCache(options);
    }

    guild = (id: string): GuildCache => {
        let guildCache = this.#guildCache.get(id);
        if (guildCache) {
            return guildCache;
        } else {
            guildCache = new GuildCache(id, this.client);
            this.#guildCache.set(id, guildCache);

            return guildCache;
        }
    };
}
