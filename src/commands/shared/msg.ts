import { KBotify } from '../../utils/kbotify';
import { MessageType } from 'kaiheila-bot-root/dist/types';
import { mentionById } from '../../utils/mention-by-id';
import { initFuncResult } from './app';
import { BaseData, ResultTypes, FuncResult, SendOptions } from './types';

interface sendFunc {
    <T extends BaseData>(
        content: string | (() => string) | string | (() => Promise<string>),
        data: T,
        resultType?: ResultTypes,
        sendOptions?: SendOptions
    ): Promise<FuncResult<T>>;
}

export class AppMsgSender {
    replyChannelId: string | undefined;
    withMention = false;
    withReply = false;
    messageType = MessageType.kmarkdown;
    private bot: KBotify | undefined;
    constructor(
        withMention = false,
        withReply = false,
        replyChannelId?: string,
        messageType = MessageType.kmarkdown
    ) {
        if (replyChannelId) this.replyChannelId = replyChannelId;
        if (withMention === false) this.withMention = false;
        if (withReply === false) this.withReply = false;
        if (messageType) this.messageType = messageType;
    }

    assignBot = (bot:KBotify):void=>{
        // console.debug('msg sender bot assigned')
        this.bot = bot
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    wrongArgs = async <T extends BaseData>(
        data: T,
        resultType = ResultTypes.WRONG_ARGS
    ) => {
        const content = `输入的参数数量不正确。如需查看帮助，请直接输入\`[命令] [帮助]\`, 如：\`.账户 绑定 帮助\``;
        return this.send(content, data, resultType, {
            reply: true,
            mention: true,
        });
    };
    /**
     * Reply with mention with default message type of msgSender.
     *
     * @param content content of the message. By default it's in kmarkdown.
     * @param data data.
     * @param [resultType] Optional. If you would like to track the result of your command, please specify. Otherwise it will return success by default.
     */
    reply: sendFunc = async (
        content,
        data,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, data, resultType, {
            reply: true,
            mention: true,
        });
    };

    replyWithoutMention: sendFunc = async (
        content,
        data,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, data, resultType, {
            reply: true,
            mention: false,
        });
    };

    mention: sendFunc = async (
        content,
        data,
        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, data, resultType, {
            reply: false,
            mention: true,
        });
    };

    sendOnly: sendFunc = async (
        content,
        data,

        resultType = ResultTypes.SUCCESS
    ) => {
        return this.send(content, data, resultType, {
            reply: false,
            mention: false,
        });
    };

    send: sendFunc = async (
        content,
        data,
        resultType = ResultTypes.SUCCESS,
        sendOptions?
    ) => {
        if (typeof content !== 'string') content = await content();

        //decide if msg should be sent in specific channel.
        let replyChannelId = data.msg.channelId;
        if (this.replyChannelId) replyChannelId = this.replyChannelId;
        if (sendOptions?.replyAt) replyChannelId = sendOptions.replyAt;

        // decide if need mention at the start.

        const withMention =
            sendOptions?.mention !== undefined
                ? sendOptions.mention
                : this.withMention;

        const msgType =
            sendOptions?.msgType !== undefined
                ? sendOptions.msgType
                : this.messageType;
        if (!this.bot)
            throw new Error('message sender used before bot assigned.');

        const msgSent = this.bot.sendChannelMessage(
            msgType,
            replyChannelId,
            (withMention ? `${mentionById(data.msg.authorId)} ` : '') + content,
            sendOptions?.reply ? data.msg.msgId : undefined
        );
        return initFuncResult(data, resultType, msgSent);
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// export function replyUnit(
//     event: string | number,
//     content: string | (() => string) | string | (() => Promise<string>),
//     resultType: ResultTypes,
//     mention = true,
//     sendOptions?: Omit<SendOptions, 'mention'>
// ): replyKv {
//     return [event, [content, resultType, { mention: mention, ...sendOptions }]];
// }

