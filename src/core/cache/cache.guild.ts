import LRU from 'lru-cache';
import { BotObject } from '../base/bot.object';
import { KBotify } from '../kbotify';
import { GuildUser } from '../user/user.guild';

const options = { max: 256, maxAge: 10 * 6e4 };

export class GuildCache extends BotObject {
    id: string;
    user = new LRU<string, Required<GuildUser>>(options);
    constructor(id: string, bot: KBotify) {
        super(bot);
        this.id = id;
    }
    getUser = async (
        id: string,
        username?: string
    ): Promise<Required<GuildUser>> => {
        let cachedUser = this.user.get(id);
        if (cachedUser && 'roles' in cachedUser) {
            return cachedUser;
        } else {
            const user = await getUserFromGuild(
                username ?? '',
                this.id,
                id,
                this._botInstance
            );
            const guildUser = new GuildUser(
                user,
                this.id,
                this._botInstance
            ) as Required<GuildUser>;
            // this.setUser(guildUser);
            return guildUser;
        }
    };
    setUser = (user: Required<GuildUser>) => {
        if ('roles' in user) {
            this.user.set(user.id, user);
        } else {
            console.error('no roles in instance', user);
        }
    };
}

async function getUserFromGuild(
    username: string,
    guildId: string,
    userId: string,
    bot: KBotify,
    maxMatchUsers: number = 50
) {
    const users = await bot.API.guild.userList(guildId, undefined, username);
    for (const user of users.items) {
        if (user.id == userId) return user;
    }
    throw new Error(
        'Cannot find user by username, userid, guildid, maxMatchUsers'
    );
}
