import { MessageType } from 'kaiheila-bot-root/dist/types';
import { BaseData, FuncResult } from './app.types';
import { BaseSession } from './session';
import { ResultTypes } from './types';

export interface SendOptions {
    mention?: boolean;
    reply?: boolean;
    replyAt?: string;
    msgType?: MessageType;
}

export interface SendFunc {
    <T extends BaseSession>(
        content: string | (() => string) | string | (() => Promise<string>),
        data: T,
        resultType?: ResultTypes,
        sendOptions?: SendOptions
    ): Promise<FuncResult<T>>;
}

export {};
