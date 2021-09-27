import { PrivateChannel } from '../channel';
import {
    AppCommand,
    FuncResult,
    initFuncResult,
    MenuCommand,
} from '../command';
import { KBotify } from '../kbotify';
import { kBotifyLogger } from '../logger';
import { ButtonEventMessage, TextMessage } from '../message';
import { SendOptions } from '../msg.types';
import { ResultTypes } from '../types';
import { BaseUser } from '../user';
import { BaseSession } from './session.base';

export class PrivateSession extends BaseSession {
    guild: undefined;
    constructor(
        command: AppCommand | MenuCommand,
        args: string[],
        msg: ButtonEventMessage | TextMessage,
        client?: KBotify
    ) {
        super(command, args, msg, client);
        if (msg instanceof TextMessage) {
            this.userId = msg.authorId;
            this.user = new BaseUser(msg.author, this.client);
        } else {
            this.userId = msg.userId;
            this.user = new BaseUser(msg.user, this.client);
        }
        this.channel = new PrivateChannel({ id: this.user.id }, this.client);
        if (msg.guildId) {
            throw new Error(
                'Trying to compose private session with guild message'
            );
        }
        // console.debug(this.user);
    }

    static fromSession = async (
        session: BaseSession
    ): Promise<PrivateSession> => {
        if (session.guild?.id) {
            throw new Error('Trying to construct PrivateSession with guild id');
        }

        return new PrivateSession(
            session.command,
            session.args,
            session.msg,
            session.client
        );
    };

    _send = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS,
        sendOptions?: Omit<SendOptions, 'temp'>
    ): Promise<FuncResult> => {
        if (typeof content !== 'string') {
            content = await content();
        }

        // decide if msg should be sent in specific channel.

        const replyChannelId = sendOptions?.channel ?? this.channel.id;

        // decide if need mention at the start.

        const msgType = sendOptions?.msgType ?? 9;

        if (!this.client) {
            throw new Error('session send used before bot assigned.');
        }

        if (msgType === 10) {
            content = content.replace(/(\r\n|\n|\r)/gm, '');
        }

        if (this.msg instanceof ButtonEventMessage) {
            if (sendOptions?.reply) {
                kBotifyLogger.info('回复按钮点击事件时使用了引用！', this);
                sendOptions.reply = undefined;
            }
        }
        try {
            const msgSent = await this.client.API.directMessage.create(
                msgType,
                replyChannelId,
                undefined,
                content,
                sendOptions?.reply ? this.msg.msgId : undefined
            );

            return initFuncResult(this, resultType, msgSent);
        } catch (error) {
            kBotifyLogger.error(error);
        }

        return initFuncResult(this, resultType);
    };
}
