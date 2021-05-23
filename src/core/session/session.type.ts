<<<<<<< HEAD:src/core/session/session.type.ts
import { FuncResult } from '../command';
import { SendOptions } from '../msg.types';
import { ResultTypes } from '../types';
import { BaseSession } from './session.base';
=======
import { BaseData, FuncResult } from "./app.types";
import { SendOptions } from "./msg.types";
import { BaseSession } from "./session";
import { ResultTypes } from "./types";
>>>>>>> origin/main:src/commands/core/session.type..ts

export interface SessionSendFunc {
    <T extends BaseSession>(
        content: string | (() => string) | string | (() => Promise<string>),
        resultType?: ResultTypes,
        sendOptions?: SendOptions
    ): Promise<FuncResult<T>>;
}
