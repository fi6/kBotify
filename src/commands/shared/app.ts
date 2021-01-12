import { KBotify } from 'utils/kbotify';
import { TextMessage } from 'kaiheila-bot-root/dist/types';

import { mentionById } from '../../utils/mention-by-id';
import { MenuCommand } from './menu';
import { AppMsgSender } from './msg';
import {
    BaseData,
    BaseCommand,
    ResultTypes,
    CommandTypes,
    FuncResult,
} from './types';

export function initFuncResult<T extends BaseData>(
    data: T,
    resultType?: ResultTypes,
    msgSent?: unknown
): FuncResult<T> {
    const funcResult: FuncResult<T> = {
        returnData: data,
        resultType: resultType ? resultType : ResultTypes.PENDING,
        msgSent: msgSent,
    };
    return funcResult;
}

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
export class AppCommand<T extends BaseData> implements BaseCommand {
    code = 'code';
    aliases = ['alias'];
    help = 'help';
    intro = 'intro';
    private bot: KBotify | undefined;
    parent: MenuCommand<any> | null = null;
    func = async (_data: BaseData): Promise<FuncResult<T> | ResultTypes> => {
        throw new Error(`${this.code}的func尚未定义`);
    };
    msgSender = new AppMsgSender();
    readonly type = CommandTypes.APP;
    constructor() {
        //
    }

    assignBot = (bot: KBotify): void => {
        this.bot = bot;
        this.msgSender.assignBot(bot);
    };

    async exec(
        command: string,
        args: string[],
        msg: TextMessage
    ): Promise<ResultTypes | void> {
        console.debug('running command: ', command, args, msg);
        if (!this.bot)
            throw new Error(
                "'Command used before assigning a bot instance or message sender.'"
            );

        try {
            if (args[0] === '帮助') {
                this.bot.sendChannelMessage(
                    9,
                    msg.channelId,
                    `${mentionById(msg.authorId)}` + this.help,
                    msg.msgId
                );
                return ResultTypes.HELP;
            }

            const data: BaseData = {
                cmdCode: this.code,
                cmdString: command,
                args: args,
                msg: msg,
            };

            const result = await this.func(data);
            if (typeof result === 'string') return result;
            return result.resultType;
        } catch (error) {
            console.error(error);
            return ResultTypes.ERROR;
        }
    }
}

export {};
