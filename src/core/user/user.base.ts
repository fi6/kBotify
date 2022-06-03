import { User, UserInGuild } from 'kaiheila-bot-root';
import { BaseObject } from '../base/bot.object';
import { BaseConnector } from '../../connector/base';
import { KBotify } from '../kbotify';

/**
 *
 *
 * @export
 * @class BaseUser
 * @extends {BaseObject}
 * @implements {User}
 */
export class BaseUser extends BaseObject implements User {
    id = '';
    username = '';
    identifyNum: string;
    online: boolean;
    avatar: string;
    bot: boolean;
    nickname?: string;

    constructor(
        userObject: User | (User & UserInGuild),
        client: BaseConnector
    ) {
        super(client);

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
        if (this.client.mentionWithSpace) {
            return `(met)${this.id}(met) `;
        } else {
            return `(met)${this.id}(met)`;
        }
    }

    grantRole = async (roleId: string | number, guildId: string) => {
        return this.client.Api.role.grant(guildId, this.id, roleId);
    };

    revokeRole = async (roleId: string | number, guildId: string) => {
        return this.client.Api.role.revoke(guildId, this.id, roleId);
    };
}
