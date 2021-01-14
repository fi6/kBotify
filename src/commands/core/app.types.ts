import { TextMessage } from 'kaiheila-bot-root/dist/types';
import { AppMsgSender } from './msg.sender';
import { BaseSession } from './session';
import { ResultTypes } from './types';

/**
 * Params for initializing AppCommand class.
 * exec is built-in in AppCommand so no need to initialize.
 *
 * @export
 * @interface AppCommandParams
 * @param code
 * @param trigger
 * @param help
 * @param func
 * @param messageBuilder (optional)
 * @template T
 */
export interface AppCommandParams<T extends BaseData> {
    code: string;
    trigger: string;
    help: string;
    intro: string;
    func: (data: T) => Promise<FuncResult<T> | ResultTypes | BaseSession>;
    useHelp: boolean;
    msgSender?: AppMsgSender;
}

export interface AppCommandFunc<T extends BaseData> {
    (data: BaseSession): Promise<FuncResult<T> | ResultTypes>;
}

/**
 * Result for App Funcs.
 *
 * @export
 * @interface FuncResult
 * @template T App Specified data
 * @property resultType
 * @property [returnData]
 * @property [msgSent]
 * @property [detail]
 */
export interface FuncResult<T> {
    resultType: ResultTypes;
    returnData?: T;
    msgSent?: unknown;
    detail?: unknown;
}

export interface BaseData {
    cmdCode: string;
    cmdString?: string;
    args: string[];
    msg: TextMessage;
    content?: string;
    other?: any;
}

export {};
