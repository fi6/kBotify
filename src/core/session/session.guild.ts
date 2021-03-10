import { AppCommand } from '../app.command';
import { Guild } from '../guild';
import { KBotify } from '../kbotify';
import { MenuCommand } from '../menu.command';
import { ButtonEventMessage, TextMessage } from '../message';
import { BaseSession } from './session.base';

export class GuildSession extends BaseSession {
    guild: Guild;
    constructor(
        command: AppCommand | MenuCommand,
        args: string[],
        msg: TextMessage | ButtonEventMessage,
        bot?: KBotify
    ) {
        super(command, args, msg, bot);
        this.guild = new Guild(msg.guildId!, this._botInstance); // TODO
    }
}
