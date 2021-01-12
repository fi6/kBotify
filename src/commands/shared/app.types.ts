import { AppMsgSender } from './msg';
import { BaseData, FuncResult, ResultTypes } from './types';

/**
 * Params for initializing AppCommand class.
 * exec is built-in in AppCommand so no need to initialize.
 *
 * @export
 * @interface AppCommandParams
 * @param code
 * @param aliases
 * @param help
 * @param func
 * @param messageBuilder (optional)
 * @template T
 */
export interface AppCommandParams<T extends BaseData> {
    code: string;
    aliases: string[];
    help: string;
    intro: string;
    func: (data: BaseData) => Promise<FuncResult<T> | ResultTypes>;
    useHelp: boolean;
    msgSender?: AppMsgSender;
}

export interface AppCommandMsgs<T extends BaseData> {
    (data: T, type: string | number): Promise<FuncResult<T>>;
}

export interface AppCommandFunc<T extends BaseData> {
    (data: T): Promise<FuncResult<T> | ResultTypes>;
}

export {};
