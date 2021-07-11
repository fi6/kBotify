import { AppCommand } from '../command/command.app';
import { KBotify } from '../kbotify';
import { MenuCommand } from '../command';
import { ButtonEventMessage, TextMessage } from '../message';
import { BaseSession } from './session.base';
import { GuildSession } from './session.guild';

export function createSession(
    command: AppCommand | MenuCommand,
    args: string[],
    msg: TextMessage | ButtonEventMessage,
    bot?: KBotify
): BaseSession | GuildSession {
    if (msg.guildId) {return new GuildSession(command, args, msg, bot); } else {return new BaseSession(command, args, msg, bot); }
}
