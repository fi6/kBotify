import { ButtonEventMessage, TextMessage } from '../message';
import { KBotify } from '.';

export function messageParser(
    msg: TextMessage | ButtonEventMessage,
    bot: KBotify
) {
    if (msg.content.startsWith('.') || msg.content.startsWith('。')) {
        // console.log(msg)
        return msg.content.slice(1).trim().split(/ +/);
    }
    if (
        msg instanceof TextMessage &&
        msg.mention.user[0] == bot.userId &&
        msg.content.startsWith('@')
    ) {
        const [, command, ...rest] = msg.content.trim().split(/ +/);

        return [command ? command.toLowerCase() : '', ...rest];
    }

    return;
}
