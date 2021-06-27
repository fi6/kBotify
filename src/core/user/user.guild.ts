import { User, UserInGuild } from 'kaiheila-bot-root';
import { Guild } from '../guild';
import { KBotify } from '../kbotify';
import { GuildSession } from '../session/session.guild';
import { BaseUser } from './user.base';
import { getUserFromGuild } from './user.get-from-guild';

export class GuildUser extends BaseUser {
    roles?: number[];
    nickname: string;
    guild: Guild;
    constructor(userObject: User & UserInGuild, guildId: string, bot: KBotify) {
        super(userObject, bot);
        this.guild = new Guild(guildId, bot);
        this.nickname = userObject.nickname;
        if ('roles' in userObject && userObject.roles) {
            this.roles = userObject.roles;
            this.client.cache
                .guild(this.guild.id)
                .setUser(this as Required<GuildUser>);
        }
    }

    full = async (): Promise<GuildUserFull> => {
        const guildCache = this.client.cache.guild(this.guild.id);
        return await guildCache.getUser(this.id, this.username);
    };
    grantRole = (roleId: string | number, guildId?: string) => {
        if (!guildId) guildId = this.guild.id;
        return this.client.API.guildRole.grant(guildId, this.id, roleId);
    };
    revokeRole = (roleId: string | number, guildId?: string) => {
        if (!guildId) guildId = this.guild.id;
        return this.client.API.guildRole.revoke(guildId, this.id, roleId);
    };
    changeNickname = (nickname: string, guildId?: string) => {
        if (!guildId) guildId = this.guild.id;
        return this.client.API.guild.nickname(guildId, nickname, this.id);
    };
}

export type GuildUserFull = Required<GuildUser>;
