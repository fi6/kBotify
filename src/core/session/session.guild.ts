import { AppCommand } from '../command/command.app';
import { Guild } from '../guild';
import { KBotify } from '../kbotify';
import { MenuCommand } from '../command';
import { ButtonEventMessage, TextMessage } from '../message';
import { BaseSession } from './session.base';
import { GuildUser } from '../user/user.guild';
import { User, UserInGuild } from 'kaiheila-bot-root';

export class GuildSession extends BaseSession {
    user: GuildUser;
    guild: Guild;
    constructor(
        command: AppCommand | MenuCommand,
        args: string[],
        msg: TextMessage | ButtonEventMessage,
        bot?: KBotify
    ) {
        super(command, args, msg, bot);

        this.guild = new Guild(msg.guildId!, this._botInstance); // TODO
        if (msg instanceof TextMessage) {
            this.userId = msg.authorId;
            this.user = new GuildUser(
                msg.author,
                this.guild.id,
                this._botInstance
            );
        } else {
            this.userId = msg.userId;
            this.user = new GuildUser(
                msg.user as any,
                this.guild.id,
                this._botInstance
            );
        }
    }
}
