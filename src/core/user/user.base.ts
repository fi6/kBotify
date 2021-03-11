import { User, UserInGuild } from 'kaiheila-bot-root';
import { BotObject } from '../base/bot.object';
import { KBotify } from '../kbotify';
import { BaseSession, GuildSession } from '../session';

export class BaseUser extends BotObject implements User {
    id: string = '';
    username: string = '';
    identifyNum: string;
    online: boolean;
    avatar: string;
    bot: boolean;
    nickname?: string;

    constructor(userObject: User | (User & UserInGuild), bot: KBotify) {
        super(bot);

        this.id = userObject.id;
        this.username = userObject.username;
        this.identifyNum = userObject.identifyNum;
        this.online = userObject.online;
        this.avatar = userObject.avatar;
        if ('nickname' in userObject) {
            this.nickname = userObject.nickname;
        }
        this.bot = userObject.bot;
    }

    get mention() {
        if (this._botInstance.mentionWithSpace) return `(met)${this.id}(met) `;
        else return `(met)${this.id}(met)`;
    }

    grantRole = (guildId: string, roleId: string | number) => {
        return this._botInstance.API.guildRole.grant(guildId, this.id, roleId);
    };
    revokeRole = (guildId: string, roleId: string | number) => {
        return this._botInstance.API.guildRole.revoke(guildId, this.id, roleId);
    };
}
