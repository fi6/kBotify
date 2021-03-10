import { AppCommand } from './app.command';
import { FuncResult } from './app.types';
import { BaseSession } from './session/session.base';

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
    readonly exec: (...args: any) => unknown;
}

export interface ResultHandler<T extends BaseSession> {
    (data: T, type: string | number): Promise<FuncResult<T>>;
}

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
