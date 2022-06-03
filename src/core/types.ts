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
    // readonly type: CommandTypes;
    exec(...args: any): unknown;
}

export type ResultHandler<T extends BaseSession> = (
    data: T,
    type: string | number
) => Promise<FuncResult<T>>;

// export enum CommandTypes {
//     menu = 'MENU',
//     help = 'HELP',
//     app = 'FUNCTION',
// }

// export enum ResultTypes {
//     pending = 'PENDING',
//     success = 'SUCCESS',
//     fail = 'FAIL',
//     error = 'ERROR',
//     help = 'HELP',
//     wrongArgs = 'WRONG_ARGS',
// }

export interface MenuCommandParams {
    code: string;
    trigger: string;
    help: string;
    apps: AppCommand[];
}

export {};
