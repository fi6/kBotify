import { ButtonClickEvent } from 'kaiheila-bot-root';
import { AppCommand } from './app.command';
import { MenuCommand } from './menu.command';
import { ButtonEventMessage, TextMessage } from './message';
import { BaseSession } from './session/session.base';
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
}
/**
 * deprecated, please use appfunc
 * @deprecated
 */
export interface AppCommandFunc<T extends BaseData> extends AppFunc<T> {}

export interface AppFunc<T extends BaseData> {
    (session: T): Promise<FuncResult<T> | ResultTypes | void>;
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
    command: AppCommand | MenuCommand;
    args: string[];
    msg: TextMessage | ButtonEventMessage;
    content?: string;
    other?: any;
}

export {};
