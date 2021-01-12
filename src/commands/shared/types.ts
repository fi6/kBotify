import { MessageType, TextMessage } from 'kaiheila-bot-root/dist/types';
import { AppCommand } from './app';

/**
 * MenuCommand and AppCommand comes from this.
 *
 * @export
 * @interface BaseCommand
 */
export interface BaseCommand {
    readonly code: string;
    readonly aliases: string[];
    readonly type: CommandTypes;
    readonly exec: (...args: any) => unknown;
}

export interface ResultHandler<T extends BaseData> {
    (data: T, type: string | number): Promise<FuncResult<T>>;
}

export type CommandInput = [string, string[], TextMessage];

export enum CommandTypes {
    MENU = 'MENU',
    HELP = 'HELP',
    APP = 'FUNCTION',
}

export enum ResultTypes {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAIL = 'FAIL',
    ERROR = 'ERROR',
    HELP = 'HELP',
    WRONG_ARGS = 'WRONG_ARGS',
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
export interface FuncResult<T extends BaseData> {
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

export type replyKv = [
    string | number,
    [
        string | (() => Promise<string>) | (() => string),
        ResultTypes,
        SendOptions?
    ]
];

export type ReplyMap = Map<
    string | number,
    [
        string | (() => Promise<string>) | (() => string),
        ResultTypes,
        SendOptions?
    ]
>;

export type replyMapUnit = replyKv;

export interface SendOptions {
    mention?: boolean;
    reply?: boolean;
    replyAt?: string;
    msgType?: MessageType;
}

export interface MenuCommandParams<T extends BaseData> {
    code: string;
    aliases: string[];
    help: string;
    apps: AppCommand<T>[];
}

export {};
