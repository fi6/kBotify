import { MessageType } from 'kaiheila-bot-root';
import { BaseData, FuncResult } from './command';
import { BaseSession } from './session/session.base';
import { ResultTypes } from './types';

export interface SendOptions {
    mention?: boolean;
    reply?: boolean;
    channel?: string;
    msgType?: MessageType;
    temp?: boolean;
}

export type SendFunc = <T extends BaseSession>(
    content: string | (() => string) | string | (() => Promise<string>),
    data: T,
    resultType?: ResultTypes,
    sendOptions?: SendOptions
) => Promise<FuncResult<T>>;

export {};
