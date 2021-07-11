import { AppCommand } from './command/command.app';
import { FuncResult } from './command';
import { BaseSession } from './session';

/**
 * MenuCommand and AppCommand comes from this.
 *
 * @export
 * @interface BaseCommand
 */
export interface BaseCommand {
    readonly code: string;
    readonly trigger: string;
    readonly type: CommandTypes;
    exec(...args: any): unknown;
}

export type ResultHandler<T extends BaseSession> = (data: T, type: string | number) => Promise<FuncResult<T>>;

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

export interface MenuCommandParams {
    code: string;
    trigger: string;
    help: string;
    apps: AppCommand[];
}

export {};
