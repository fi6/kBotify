import { KBotify } from 'init/KBot';
import { MessageType } from 'kaiheila-bot-root/dist/types';
import { BaseData, ResultTypes, FuncResult, SendOptions } from './types';
interface sendFunc {
    <T extends BaseData>(content: string | (() => string) | string | (() => Promise<string>), data: T, resultType?: ResultTypes, sendOptions?: SendOptions): Promise<FuncResult<T>>;
}
export declare class AppMsgSender {
    replyChannelId: string | undefined;
    withMention: boolean;
    withReply: boolean;
    messageType: MessageType;
    bot: KBotify;
    constructor(withMention?: boolean, withReply?: boolean, replyChannelId?: string, messageType?: MessageType);
    wrongArgs: <T extends BaseData>(data: T, resultType?: ResultTypes) => Promise<FuncResult<T>>;
    /**
     * Reply with mention with default message type of msgSender.
     *
     * @param content content of the message. By default it's in kmarkdown.
     * @param data data.
     * @param [resultType] Optional. If you would like to track the result of your command, please specify. Otherwise it will return success by default.
     */
    reply: sendFunc;
    replyWithoutMention: sendFunc;
    mention: sendFunc;
    sendOnly: sendFunc;
    send: sendFunc;
}
export {};
