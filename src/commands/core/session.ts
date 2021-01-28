import { KMarkDownMessage, TextMessage } from 'kaiheila-bot-root/dist/types';
import {
    KHMessage,
    KHSystemMessage,
    KHTextMessage,
} from 'kaiheila-bot-root/dist/types/kaiheila/kaiheila.type';
import { KBotify } from '../../utils/kbotify';
import { mentionById } from '../../utils/mention-by-id';
import { AppCommand, initFuncResult } from './app.command';
import { BaseData } from './app.types';
import { MenuCommand } from './menu.command';
import { SendOptions } from './msg.types';
import { SessionSendFunc } from './session.type';
import { ResultTypes } from './types';

export class BaseSession implements BaseData {
    cmdString?: string | undefined;
    command: AppCommand<any> | MenuCommand<any>;
    args: string[];
    msg: KHSystemMessage | TextMessage | KMarkDownMessage;
    content?: string | undefined;
    other?: any;
    bot: KBotify;
    /**
     * 会话的用户ID。
     * 如果是文字消息，则返回发送者ID，如果是按钮事件，则返回点击者ID。
     *
     * @type {string}
     * @memberof BaseSession
     */
    userId: string;
    constructor(
        command: AppCommand<any> | MenuCommand<any>,
        args: string[],
        msg: KHSystemMessage | TextMessage | KMarkDownMessage,
        bot?: KBotify
    ) {
        this.command = command;
        this.args = args;
        this.msg = msg;
        this.bot = bot ?? this.command.bot!;
        this.userId =
            msg instanceof TextMessage || msg instanceof KMarkDownMessage
                ? msg.authorId
                : msg.extra.body.user_id;
    }

    reply: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        temp = false,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: true,
            mention: true,
            temp: temp,
        });
    };

    replyOnly: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        temp = false,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: true,
            mention: false,
            temp: temp,
        });
    };

    replyCard: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        temp = false,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: true,
            msgType: 10,
            temp: temp,
        });
    };

    mention: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        temp = false,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: false,
            mention: true,
            temp: temp,
        });
    };

    sendOnly: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        temp = false,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, resultType, {
            reply: false,
            mention: false,
            temp: temp,
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
        const func = (msg: TextMessage | KMarkDownMessage) => {
            if (msg.authorId != this.userId) return;
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
     * @memberof BaseSession
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    send = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS,
        sendOptions?: SendOptions
    ) => {
        if (typeof content !== 'string') content = await content();

        //decide if msg should be sent in specific channel.
        let replyChannelId = this.msg.channelId;
        replyChannelId =
            this.msg.type === 255
                ? (this.msg as KHSystemMessage).extra.body.target_id
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
            if (withMention)
                console.warn('发送卡片消息时使用了mention！', this);
            withMention = false;
            content = content.replace(/(\r\n|\n|\r)/gm, '');
        }

        content = (withMention ? `${mentionById(this.userId)}` : '') + content;

        if ((this.msg as KHSystemMessage).extra?.type === 'message_btn_click') {
            if (sendOptions?.reply) {
                console.warn('回复按钮点击事件时使用了引用！', this);
                sendOptions.reply = undefined;
            }
        }

        const msgSent = await this.bot.sendChannelMessage(
            msgType,
            replyChannelId,
            content,
            sendOptions?.reply ? this.msg.msgId : undefined,
            sendOptions?.temp ? this.userId : undefined
        );
        return initFuncResult(this, resultType, msgSent);
    };
}
