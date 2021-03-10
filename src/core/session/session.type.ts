import { FuncResult } from '../command';
import { SendOptions } from '../msg.types';
import { ResultTypes } from '../types';
import { BaseSession } from './session.base';

export interface SessionSendFunc {
    <T extends BaseSession>(
        content: string | (() => string) | string | (() => Promise<string>),
        resultType?: ResultTypes,
        sendOptions?: SendOptions
    ): Promise<FuncResult<T>>;
}
