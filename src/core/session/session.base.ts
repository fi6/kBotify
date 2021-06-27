import { KBotify } from '../..';
import { mentionById } from '../../utils/mention-by-id';
import { AppCommand, initFuncResult } from '../command/command.app';

import { BaseObject } from '../base/bot.object';
import { Channel } from '../channel';

import { ButtonEventMessage, TextMessage } from '../message';
import { SendOptions } from '../msg.types';
import { SessionSendFunc } from './session.type';
import { ResultTypes } from '../types';
import { BaseUser } from '../user';
import { BaseData } from '../command/types';
import { MenuCommand } from '../command/command.menu';
import { Card, CardObject } from '../card';

export class BaseSession extends BaseObject implements BaseData {
    /**
     * 命令字符串
     */
    cmdString?: string | undefined;
    command: AppCommand | MenuCommand;
    args: string[];
    msg: ButtonEventMessage | TextMessage;
    channel: Channel;
    content: string | undefined;
    // TODO: add guild
    guildId?: string;
    other?: any;
    /**
     * 会话的用户ID。
     * 如果是文字消息，则返回发送者ID，如果是按钮事件，则返回点击者ID。
     *
     * @type {string}
     * @memberof BaseSession
     */
    userId: string;
    user: BaseUser;
    constructor(
        command: AppCommand | MenuCommand,
        args: string[],
        msg: ButtonEventMessage | TextMessage,
        bot?: KBotify
    ) {
        super(bot ?? msg.client);
        this.command = command;
        this.args = args;
        this.msg = msg;
        this.channel = new Channel(
            { channelId: msg.channelId, channelType: msg.channelType },
            this.client
        );
        if (msg instanceof TextMessage) {
            this.userId = msg.authorId;
            this.user = new BaseUser(msg.author, this.client);
        } else {
            this.userId = msg.userId;
            this.user = new BaseUser(msg.user, this.client);
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

    replyCard = async (
        content:
            | string
            | (() => string)
            | (() => Promise<string>)
            | CardObject[]
            | Card
    ) => {
        return await this._sendCard(content, false, true);
    };

    replyCardTemp = async (
        content:
            | string
            | (() => string)
            | (() => Promise<string>)
            | CardObject[]
            | Card
    ) => {
        return await this._sendCard(content, true, true);
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

    private _sendCard = async (
        content:
            | string
            | (() => string)
            | (() => Promise<string>)
            | CardObject[]
            | Card,
        temp = false,
        reply = false
    ) => {
        const str =
            content instanceof Card
                ? JSON.stringify([content])
                : Array.isArray(content)
                ? JSON.stringify(content)
                : content;
        return this._send(str, ResultTypes.SUCCESS, {
            msgType: 10,
            reply: reply,
            mention: false,
            temp: temp,
        });
    };

    sendCard = async (
        content:
            | string
            | (() => string)
            | (() => Promise<string>)
            | CardObject[]
            | Card
    ) => {
        return this._sendCard(content, false);
    };

    sendCardTemp = async (
        content:
            | string
            | (() => string)
            | (() => Promise<string>)
            | CardObject[]
            | Card
    ) => {
        return this._sendCard(content, true);
    };

    /**
     * WIP, Do not use
     * @param messageId
     * @param content
     * @param quote
     */
    updateMessage = async (
        messageId: string,
        content: string | CardObject[],
        quote?: string
    ) => {
        if (Array.isArray(content)) {
            content = JSON.stringify(content);
        }
        return await this.client.API.message.update(
            messageId,
            content,
            quote
        );
    };

    /**
     * WIP, Do not use
     * @param messageId
     * @param content
     * @param quote
     */
    updateMessageTemp = async (
        messageId: string,
        content: string | CardObject[],
        quote?: string
    ) => {
        if (Array.isArray(content)) {
            content = JSON.stringify(content);
        }
        this.client.post('v3/message/update', {
            msg_id: messageId,
            content: content,
            quote: quote,
            temp_target_id: this.user.id,
        });
    };

    /**
     * 设置文字回复触发事件
     *
     * @param condition 文字满足的要求，包含的文字或正则表达式
     * @param timeout 单位：ms 回复触发有效时间，默认为1分钟
     * @param callback 触发后的回调函数
     * @returns
     */
    setTextTrigger = (
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
            this.client.message.off('text', func);
        };
        this.client.message.on('text', func);
        if (timeout)
            setTimeout(() => {
                this.client.message.off('text', func);
            }, timeout);
        return () => {
            this.client.message.off('text', func);
        };
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
        replyChannelId = sendOptions?.channel ?? replyChannelId;

        // decide if need mention at the start.

        const msgType = sendOptions?.msgType ?? 9;

        let withMention = sendOptions?.mention ?? false;

        if (!this.client)
            throw new Error('session send used before bot assigned.');

        if (msgType == 10) {
            if (withMention)
                console.warn('发送卡片消息时使用了mention！', this);
            withMention = false;
            content = content.replace(/(\r\n|\n|\r)/gm, '');
        }

        content = (withMention ? `${mentionById(this.userId)}` : '') + content;

        if (this.msg instanceof ButtonEventMessage) {
            if (sendOptions?.reply) {
                console.warn('回复按钮点击事件时使用了引用！', this);
                sendOptions.reply = undefined;
            }
        }
        try {
            const msgSent = await this.client.API.message.create(
                msgType,
                replyChannelId,
                content,
                sendOptions?.reply ? this.msg.msgId : undefined,
                sendOptions?.temp ? this.userId : undefined
            );
            return initFuncResult(this, resultType, msgSent);
        } catch (error) {
            console.error(error);
        }
        return initFuncResult(this, resultType);
    };
}
