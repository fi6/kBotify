import { MessageCreateResponseInternal } from 'kaiheila-bot-root/dist/api/message/message.types';
import { ButtonEventMessage, TextMessage } from '../message';
import { BaseSession, GuildSession } from '../session';
import { ResultTypes } from '../types';
import { AppCommand } from './command.app';
import { MenuCommand } from './command.menu';

/**
 * Params for initializing MenuCommand class.
 *
 * @export
 * @interface MenuCommandParams
 * @template T extends BaseData
 * @param code string
 * @param trigger string
 * @param help string
 * @param apps AppCommand<T>[]
 */
export interface MenuCommandParams {
    code: string;
    trigger: string;
    help: string;
    apps: AppCommand[];
}

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
    func(data: T): Promise<FuncResult<T> | ResultTypes | BaseSession>;
    useHelp: boolean;
}
/**
 * deprecated, please use appfunc
 * @deprecated
 */
export type AppCommandFunc<T extends BaseSession> = AppFunc<T>;

export type AppFunc<T extends GuildSession | BaseSession> = (
    session: T
) => Promise<FuncResult<any> | ResultTypes | void>;

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
    session?: BaseSession;
    msgSent?: MessageCreateResponseInternal;
    detail?: T;
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
