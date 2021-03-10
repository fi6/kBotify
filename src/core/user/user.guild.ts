import { User, UserInGuild } from 'kaiheila-bot-root';
import { KBotify } from '../kbotify';
import { GuildSession } from '../session/session.guild';
import { BaseUser } from './user.base';
import { getUserFromGuild } from './user.get-from-guild';

export class GuildUser extends BaseUser {
    roles?: number[];
    nickname: string;
    #session: GuildSession;
    constructor(
        session: GuildSession,
        userObject: User & UserInGuild,
        bot: KBotify
    ) {
        super(userObject, bot);
        this.#session = session;
        this.nickname = userObject.nickname;
        if ('roles' in userObject) {
            this.roles = userObject.roles;
        } else {
            this.roles = undefined;
        }
    }

    full = async (): Promise<GuildUserFull> => {
        const userFull = await getUserFromGuild(
            this.username,
            this.#session.guild.id,
            this.id,
            this._botInstance
        );
        const roles = userFull.roles;
        this.roles = roles;
        return this as GuildUserFull;
    };
}

export type GuildUserFull = Required<GuildUser>;
