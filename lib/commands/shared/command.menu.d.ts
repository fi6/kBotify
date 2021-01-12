import { TextMessage } from 'kaiheila-bot-root/dist/types';
import { AppCommand } from './command.app';
import { BaseData, BaseCommand, ResultTypes, CommandTypes, FuncResult } from './command.types';
import { KBot } from 'init/setupBot';
/**
 * Class of menu command.
 * You should initialize with params: code, aliases, help, apps(array of AppCommand).
 *
 * @export
 * @class MenuCommand
 * @template T
 */
export declare class MenuCommand<T extends BaseData> implements BaseCommand {
    code: string;
    aliases: string[];
    help: string;
    commandMap: Map<string, AppCommand<T>>;
    bot: KBot;
    constructor(...apps: AppCommand<T>[]);
    readonly type = CommandTypes.MENU;
    /**
     * Find given command by its class and run exec. If given no args(no subcommand) or given '帮助' as subcommand, it will return the help string.
     *
     * @param command
     * @param args
     * @param msg
     * @return {*}
     * @memberof MenuCommand
     */
    exec(command: string, args: string[], msg: TextMessage): Promise<ResultTypes | void>;
    defaultMessageSender: <T_1 extends BaseData>(result: FuncResult<T_1> | null, inputMsg?: TextMessage | undefined, inputContent?: string | undefined) => Promise<ResultTypes | FuncResult<T_1>>;
}
export {};
