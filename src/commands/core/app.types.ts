import { KMarkDownMessage, TextMessage } from 'kaiheila-bot-root/dist/types';
import { KHMessage, KHSystemMessage } from 'kaiheila-bot-root/dist/types/kaiheila/kaiheila.type';
import { AppCommand } from './app.command';
import { MenuCommand } from './menu.command';
import { MsgSender } from './msg.sender';
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
    msgSender?: MsgSender;
}

export interface AppCommandFunc<T extends BaseData> {
    (data: T): Promise<FuncResult<T> | ResultTypes | void>;
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
    cmdString?: string;
    command: AppCommand<any> | MenuCommand<any>;
    args: string[];
    msg: KHSystemMessage | TextMessage | KMarkDownMessage;
    content?: string;
    other?: any;
}

export {};
