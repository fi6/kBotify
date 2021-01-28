import { BaseData, FuncResult } from "./app.types";
import { SendOptions } from "./msg.types";
import { BaseSession } from "./session";
import { ResultTypes } from "./types";

export interface SessionSendFunc {
    <T extends BaseSession>(
        content: string | (() => string) | string | (() => Promise<string>),
        temp: boolean,
        resultType?: ResultTypes,
        sendOptions?: SendOptions
    ): Promise<FuncResult<T>>;
}