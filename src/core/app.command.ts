import { MenuCommand } from './menu.command';
import { BaseCommand, ResultTypes, CommandTypes } from './types';
import { AppCommandFunc, FuncResult } from './app.types';
import { BaseSession } from './session';
import { KBotify } from '..';

export function initFuncResult<T>(
    data: T,
    resultType?: ResultTypes,
    msgSent?: unknown
): FuncResult<any> {
    const funcResult: FuncResult<any> = {
        returnData: data,
        resultType: resultType ? resultType : ResultTypes.PENDING,
        msgSent: msgSent,
    };
    return funcResult;
}

/**
 * Class of functional command.
 * you need to initialize code, trigger, help, func for proper usage.
 * Please return ResultTypes.HELP if you need to show the help message. AppCommand.exec will handle this.
 *
 * @export
 * @class AppCommand
 * @param code 功能代号
 * @param trigger 触发功能可用的字符串
 * @param help 功能提示/帮助文字
 * @param intro 功能简介，用于生成菜单
 * @param func 负责执行功能
 * @param [messageSender] 负责发送消息
 * @template T
 */
export abstract class AppCommand implements BaseCommand {
    code = 'code';
    abstract trigger: string;
    help = 'help';
    intro = 'intro';
    bot: KBotify | undefined;
    parent: MenuCommand | null = null;
    func: AppCommandFunc<BaseSession> = async (_data) => {
        throw new Error(`${this.code}的func尚未定义`);
    };
    readonly type = CommandTypes.APP;

    constructor() {
        //
    }

    init = (bot: KBotify): void => {
        this.bot = bot;
    };

    setTriggerOnce(trigger: string | RegExp, timeout: number): void {
        if (!this.bot)
            throw new Error('Temp trigger set before bot is assigned.');
        this.bot.once('message', (msg: KHTextMessage) => {
            if (trigger instanceof RegExp) {
                if (!trigger.test(msg.content)) return;
            } else {
                if (!msg.content.includes(trigger)) return;
            }
        });
    }

    async exec(
        command: string,
        args: string[],
        msg: any
    ): Promise<ResultTypes | void>;

    async exec(session: BaseSession): Promise<ResultTypes | void>;

    async exec(
        sessionOrCommand: BaseSession | string,
        args?: string[],
        msg?: KHSystemMessage | TextMessage | KMarkDownMessage
    ): Promise<ResultTypes | void> {
        if (sessionOrCommand instanceof BaseSession) {
            sessionOrCommand.command = this;
            return this.run(sessionOrCommand);
        } else {
            if (!args || !msg)
                throw new Error(
                    'Missing args ans msg when using exec(command, args, msg)'
                );
            return this.run(new BaseSession(this, args!, msg!));
        }
    }

    private async run(session: BaseSession): Promise<ResultTypes> {
        const args = session.args;
        const msg = session.msg;
        console.debug('running command: ', session.cmdString, args, msg);
        if (!this.bot)
            throw new Error(
                "'Command used before assigning a bot instance or message sender.'"
            );

        try {
            if (args[0] === '帮助') {
                session.reply(this.help);
                return ResultTypes.HELP;
            }

            const result = await this.func(session as any);
            if (typeof result === 'string' || !result)
                return result ? result : ResultTypes.SUCCESS;
            return result.resultType;
        } catch (error) {
            console.error(error);
            return ResultTypes.ERROR;
        }
    }
}

export {};
