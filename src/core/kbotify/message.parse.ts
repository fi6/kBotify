import { ButtonEventMessage, TextMessage } from '../message';
import { KBotify } from '.';

export const messageParser = (
    msg: TextMessage | ButtonEventMessage,
    client: KBotify
): string[] | void => {
    if (msg.content.startsWith('.') || msg.content.startsWith('。')) {
        // console.log(msg)
        return msg.content.slice(1).trim().split(/ +/);
    } else if (
        msg instanceof TextMessage &&
        msg.mention.user &&
        msg.mention.user[0] === client.userId &&
        msg.content.startsWith('@')
    ) {
        const [, command, ...rest] = msg.content.trim().split(/ +/);

        return [command ? command.toLowerCase() : '', ...rest];
    } else if (msg.channelType === 'PERSON') {
        const [command, ...rest] = msg.content.trim().split(/ +/);

        return [command ? command.toLowerCase() : '', ...rest];
    }

    return;
};
