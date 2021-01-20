import { BaseData, FuncResult } from "./app.types";
import { SendOptions } from "./msg.types";
import { ResultTypes } from "./types";

export interface SessionSendFunc {
    <T extends BaseData>(
        content: string | (() => string) | string | (() => Promise<string>),
        resultType?: ResultTypes,
        sendOptions?: SendOptions
    ): Promise<FuncResult<T>>;
}