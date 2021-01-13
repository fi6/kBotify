import { TextMessage } from 'kaiheila-bot-root/dist/types';

import { AppCommand } from './app';
import {
    BaseData,
    BaseCommand,
    ResultTypes,
    CommandTypes,
    FuncResult,
} from './types';
import { KBotify } from 'utils/kbotify';

/**
 * Class of menu command.
 * You should initialize with params: code, aliases, help, apps(array of AppCommand).
 *
 * @export
 * @class MenuCommand
 * @template T
 */
export class MenuCommand<T extends BaseData> implements BaseCommand {
    code = 'code';
    trigger = 'alias';
    help = 'help';
    appMap = new Map<string, AppCommand<T>>();
    bot: KBotify | undefined;
    constructor(...apps: AppCommand<T>[]) {
        apps.forEach((app) => {
            this.appMap.set(app.trigger, app);
            app.parent = this;
        });
    }
    readonly type = CommandTypes.MENU;

    assignBot = (bot: KBotify): void => {
        this.bot = bot;
    };
    /**
     * Add alias for a certain app to this menu.
     *
     * @param app instance of app command.
     * @param alias
     * @memberof MenuCommand
     */
    addAlias(app: AppCommand<T>, alias: string): void {
        this.appMap.set(alias, app);
        app.parent = this;
    }

    /**
     * Find given command by its class and run exec. If given no args(no subcommand) or given '帮助' as subcommand, it will return the help string.
     *
     * @param command
     * @param args
     * @param msg
     * @return {*}
     * @memberof MenuCommand
     */
    async exec(
        command: string,
        args: string[],
        msg: TextMessage
    ): Promise<ResultTypes | void> {
        if (!command || args === undefined || !msg) {
            throw new Error(
                `command/args/msg is missing when exec MenuCommand ${this.code}.`
            );
        }
        try {
            if (!args.length) {
                this.defaultMessageSender(null, msg, this.help);
                return ResultTypes.HELP;
            }

            command = args.shift() as string;

            const app = this.appMap.get(command);
            if (!app) {
                this.defaultMessageSender(
                    null,
                    msg,
                    '未找到对应命令。如需查看菜单请发送`.' +
                        `${this.trigger[0]}` +
                        '`'
                );
                return ResultTypes.WRONG_ARGS;
            }
            return app.exec(command, args, msg);
        } catch (error) {
            console.error(error);
            return ResultTypes.ERROR;
        }
    }

    defaultMessageSender = async <T extends BaseData>(
        result: FuncResult<T> | null,
        inputMsg?: TextMessage,
        inputContent?: string
    ): Promise<FuncResult<T> | ResultTypes> => {
        let msg, content;
        if (!result?.returnData) {
            if (inputMsg && inputContent) {
                msg = inputMsg;
                content = inputContent;
            } else {
                throw new Error();
            }
        } else {
            msg = inputMsg ? inputMsg : result.returnData.msg;

            content = inputContent
                ? inputContent
                : (result.returnData.content as string);
        }

        if (!this.bot)
            throw new Error('Menu command used before bot assigned:');

        this.bot.sendChannelMessage(9, msg.channelId, content, msg.msgId);

        return result ? result.resultType : ResultTypes.SUCCESS;
    };
}

export {};
