

import { KBotify } from '..';
import { mentionById } from '../utils/mention-by-id';
import { AppCommand, initFuncResult } from './app.command';
import { BaseData } from './app.types';
import { MenuCommand } from './menu.command';
import { SendOptions } from './msg.types';
import { SessionSendFunc } from './session.type';
import { ResultTypes } from './types';
import { User } from './user';

export class BaseSession implements BaseData {
    cmdString?: string | undefined;
    command: AppCommand | MenuCommand;
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
    user: User;
    constructor(
        command: AppCommand | MenuCommand,
        args: string[],
        msg: KHSystemMessage | TextMessage | KMarkDownMessage,
        bot?: KBotify
    ) {
        this.command = command;
        this.args = args;
        this.msg = msg;
        this.bot = bot ?? this.command.bot!;
        if (msg instanceof TextMessage || msg instanceof KMarkDownMessage) {
            this.userId = msg.authorId;
            this.user = new User(msg.author, this.bot);
        } else {
            this.userId = msg.extra.body.user_id;
            this.user = new User(msg.extra.body.user_info, this.bot);
        }
        // console.debug(this.user);
    }

    reply: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: true,
            mention: true,
            temp: false,
        });
    };

    replyTemp: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: true,
            mention: true,
            temp: true,
        });
    };

    replyCard: SessionSendFunc = async (
        content,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: true,
            msgType: 10,
        });
    };

    replyCardTemp: SessionSendFunc = async (
        content,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: true,
            msgType: 10,
            temp: true,
        });
    };

    quote: SessionSendFunc = async (
        content,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: true,
            mention: false,
            temp: false,
        });
    };

    quoteTemp: SessionSendFunc = async (
        content,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: true,
            mention: false,
            temp: true,
        });
    };

    mention: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: false,
            mention: true,
            temp: false,
        });
    };

    mentionTemp: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: false,
            mention: true,
            temp: true,
        });
    };

    send: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: false,
            mention: false,
            temp: false,
        });
    };

    sendTemp: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>),
        resultType = ResultTypes.SUCCESS
    ) => {
        return this._send(content, resultType, {
            reply: false,
            mention: false,
            temp: true,
        });
    };

    sendCard: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>)
    ) => {
        return this._send(content, ResultTypes.SUCCESS, {
            msgType: 10,
            reply: false,
            mention: false,
            temp: false,
        });
    };

    sendCardTemp: SessionSendFunc = async (
        content: string | (() => string) | string | (() => Promise<string>)
    ) => {
        return this._send(content, ResultTypes.SUCCESS, {
            msgType: 10,
            reply: false,
            mention: false,
            temp: true,
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
    ) => {
        const func = (msg: any) => {
            msg = msg as TextMessage;
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
        return ()=>{this.bot.off('message', func);}
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
    _send = async (
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
        replyChannelId = sendOptions?.replyAt ?? replyChannelId;

        // decide if need mention at the start.

        const msgType = sendOptions?.msgType ?? 9;

        let withMention = sendOptions?.mention ?? false;

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
        if (msgSent.data.code == 40000) {
            console.error('msg sent error!', msgSent.data);
        }
        return initFuncResult(this, resultType, msgSent);
    };
}