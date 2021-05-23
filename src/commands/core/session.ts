import { TextMessage } from 'kaiheila-bot-root/dist/types';
import {
    KHMessage,
    KHSystemMessage,
} from 'kaiheila-bot-root/dist/types/kaiheila/kaiheila.type';
import { KBotify } from '../../utils/kbotify';
import { mentionById } from '../../utils/mention-by-id';
import { AppCommand, initFuncResult } from './app.command';
import { BaseData } from './app.types';
import { MenuCommand } from './menu.command';
import { SessionSendFunc } from './session.type';
import { ResultTypes } from './types';

export class BaseSession implements BaseData {
    cmdString?: string | undefined;
    command: AppCommand<any> | MenuCommand<any>;
    args: string[];
    msg: KHMessage;
    content?: string | undefined;
    other?: any;
    bot: KBotify;
    constructor(
        command: AppCommand<any> | MenuCommand<any>,
        args: string[],
        msg: KHMessage,
        bot?: KBotify
    ) {
        this.command = command;
        this.args = args;
        this.msg = msg;
        this.bot = bot ?? this.command.bot!;
    }

    reply: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: true,
            mention: true,
        });
    };

    replyOnly: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: true,
            mention: false,
        });
    };

    mention: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: false,
            mention: true,
        });
    };

    sendOnly: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: false,
            mention: false,
        });
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
    /**
     * 发送消息。
     * ### 接收
     * 如果接收的消息为文字消息，则可以使用引用和@。
     * 如果接收的消息为按钮点击事件消息，则可以使用@。
     * ### 发送
     * 如果发送的消息为文字或kmarkdown，则可以使用引用和@。
     * 如果发送的消息为卡片消息，则可以使用引用。
     *
     * @param content
     * @param [resultType=ResultTypes.SUCCESS]
     * @param [sendOptions]
     * @type {SessionSendFunc}
     * @memberof BaseSession
     */
    send: SessionSendFunc = async (
        content,
        resultType = ResultTypes.SUCCESS,
        sendOptions?
    ) => {
        if (typeof content !== 'string') content = await content();

        //decide if msg should be sent in specific channel.
        let replyChannelId = this.msg.channelId;
        replyChannelId =
            this.msg.type === 255
                ? this.msg.extra.body.target_id
                : replyChannelId;
        replyChannelId =
            this.command.msgSender.replyChannelId ?? replyChannelId;
        replyChannelId = sendOptions?.replyAt ?? replyChannelId;

        // decide if need mention at the start.

        const msgType =
            sendOptions?.msgType ?? this.command.msgSender.defaultMessageType;

        let withMention =
            sendOptions?.mention ?? this.command.msgSender.withMention;

        if (!this.bot)
            throw new Error('message sender used before bot assigned.');

        if (msgType == 10) {
            if (withMention) console.warn('发送卡片消息时使用了mention！', this)
            withMention = false;
            content = content.replace(/(\r\n|\n|\r)/gm, '');
        }

        if (this.msg.extra?.type === 'message_btn_click') {
            if (sendOptions?.reply) console.warn('回复按钮点击事件时使用了引用！', this)
                const msgSent = this.bot.sendChannelMessage(
                    msgType,
                    replyChannelId,
                    (withMention
                        ? `${mentionById(this.msg.extra.body.user_id)}`
                        : '') + content
                );
            return initFuncResult(this, resultType, msgSent);
        }
        content =
            (withMention ? `${mentionById(this.msg.authorId)}` : '') + content;
        const msgSent = await this.bot.sendChannelMessage(
            msgType,
            replyChannelId,
            content,
            sendOptions?.reply ? this.msg.msgId : undefined
        );
        return initFuncResult(this, resultType, msgSent);
    };
}