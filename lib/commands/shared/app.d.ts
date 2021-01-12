import { KBotify } from 'init/KBot';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
import { MenuCommand } from './menu';
import { AppMsgSender } from './msg';
import { BaseData, BaseCommand, ResultTypes, CommandTypes, FuncResult } from './types';
export declare function initFuncResult<T extends BaseData>(data: T, resultType?: ResultTypes, msgSent?: unknown): FuncResult<T>;
/**
 * Class of functional command.
 * you need to initialize code, aliases, help, func for proper usage.
 * Please return ResultTypes.HELP if you need to show the help message. AppCommand.exec will handle this.
 *
 * @export
 * @class AppCommand
 * @param code 功能代号
 * @param aliases 触发功能可用的字符串
 * @param help 功能提示/帮助文字
 * @param intro 功能简介，用于生成菜单
 * @param func 负责执行功能
 * @param [messageSender] 负责发送消息
 * @template T
 */
export declare class AppCommand<T extends BaseData> implements BaseCommand {
    code: string;
    aliases: string[];
    help: string;
    intro: string;
    private bot;
    parent: MenuCommand<any> | null;
    func: (_data: BaseData) => Promise<FuncResult<T> | ResultTypes>;
    msgSender: AppMsgSender;
    readonly type = CommandTypes.APP;
    constructor();
    assignBot: (bot: KBotify) => void;
    exec(command: string, args: string[], msg: TextMessage): Promise<ResultTypes | void>;
}
export {};
