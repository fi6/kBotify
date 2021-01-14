import {  TextMessage } from 'kaiheila-bot-root/dist/types';
import { KBotify } from '../../utils/kbotify';
import { mentionById } from '../../utils/mention-by-id';
import { AppCommand, initFuncResult } from './app.command';
import { BaseData, FuncResult } from './app.types';
import { SessionSendFunc } from './session.type.';
import { ResultTypes } from './types';

export class BaseSession implements BaseData {
    cmdCode: string;
    cmdString?: string | undefined;
    command: AppCommand<any>;
    args: string[];
    msg: TextMessage;
    content?: string | undefined;
    other?: any;
    bot: KBotify;
    constructor(command: AppCommand<any>, args: string[], msg: TextMessage) {
        this.command = command;
        this.cmdCode = command.code;
        this.args = args;
        this.msg = msg;
        this.bot = this.command.bot!;
    }
    reply = (content: string): Promise<FuncResult<any>> => {
        return this.command.msgSender.reply(content, this);
    };
    sendOnly = (content: string): Promise<FuncResult<any>> => {
        return this.command.msgSender.sendOnly(content, this);
    };
    /**
     * If reply match the condition, trigger callback(once)
     *
     * @param condition string or regexp
     * @param [timeout=6e4] timeout in ms
     * @param callback
     * @memberof BaseSession
     */
    setReplyTrigger = (
        condition: string | RegExp,
        timeout: number | null = 6e4,
        callback: (msg: TextMessage) => void
    ): void => {
        const func = (msg: TextMessage) => {
            if (msg.authorId != this.msg.authorId) return;
            if (condition instanceof RegExp) {
                if (!condition.test(msg.content)) return;
            } else if (!msg.content.includes(condition)) return;
            callback(msg);
            this.bot.off('message', func);
        };
        this.bot.on('message', func);
        if (timeout)
            setTimeout(() => {
                this.bot.off('message', func);
            }, timeout);
    };

    send: SessionSendFunc = async (
        content,
        resultType = ResultTypes.SUCCESS,
        sendOptions?
    ) => {
        if (typeof content !== 'string') content = await content();

        //decide if msg should be sent in specific channel.
        let replyChannelId = this.msg.channelId;
        replyChannelId =
            this.command.msgSender.replyChannelId ?? replyChannelId;
        replyChannelId = sendOptions?.replyAt ?? replyChannelId;

        // decide if need mention at the start.
        const withMention =
            sendOptions?.mention ?? this.command.msgSender.withMention;
        const msgType =
            sendOptions?.msgType ?? this.command.msgSender.messageType;

        if (!this.bot)
            throw new Error('message sender used before bot assigned.');

        const msgSent = this.bot.sendChannelMessage(
            msgType,
            replyChannelId,
            (withMention ? `${mentionById(this.msg.authorId)} ` : '') + content,
            sendOptions?.reply ? this.msg.msgId : undefined
        );
        return initFuncResult(this, resultType, msgSent);
    };
}
