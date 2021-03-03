import { User, UserInGuild } from 'kaiheila-bot-root';
import { BotObject } from '../base/bot.object';
import { KBotify } from '../kbotify';

export class BaseUser extends BotObject implements User {
    id: string = '';
    username: string = '';
    identifyNum: string;
    online: boolean;
    avatar: string;
    bot: boolean;
    roles?: number[] | undefined;

    constructor(userObject: User, bot: KBotify) {
        super(bot);
        this.id = userObject.id;
        this.username = userObject.username;
        this.identifyNum = userObject.identifyNum;
        this.online = userObject.online;
        this.avatar = userObject.avatar;
        this.bot = userObject.bot;
    }

    get mention() {
        return `(met)${this.id}(met)`;
    }

    grantRole = (guildId: string, roleId: string | number) => {
        return this._botInstance.API.guildRole.grant(guildId, this.id, roleId);
    };
    revokeRole = (guildId: string, roleId: string | number) => {
        return this._botInstance.API.guildRole.revoke(guildId, this.id, roleId);
    };
}
