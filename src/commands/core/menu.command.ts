import { TextMessage } from 'kaiheila-bot-root/dist/types';

import { AppCommand } from './app.command';
import { BaseCommand, ResultTypes, CommandTypes } from './types';
import { KBotify } from '../../utils/kbotify';
import { BaseData, FuncResult } from './app.types';

/**
 * Class of menu command.
 * You should initialize with params: code, trigger, help, apps(array of AppCommand).
 *
 * @export
 * @class MenuCommand
 * @param code
 * @param trigger
 * @param help
 * @template T extends BaseData
 */
export abstract class MenuCommand<T extends BaseData> implements BaseCommand {
    code = 'code';
    abstract trigger: string;
    help = 'help';
    appMap = new Map<string, AppCommand<any>>();
    private bot: KBotify | undefined;
    readonly type = CommandTypes.MENU;

    /**
     * Creates an instance of MenuCommand.
     * this will add trigger of the app to the menu.
     *
     * @param apps instances of AppCommand
     * @memberof MenuCommand
     */
    constructor(...apps: AppCommand<any>[]) {
        apps.forEach((app) => {
            this.appMap.set(app.trigger, app);
            app.parent = this;
        });
    }

    assignBot = (bot: KBotify): void => {
        this.bot = bot;
        for (const app of this.appMap.values()) {
            app.assignBot(bot);
        }
    };

    /**
     * Add alias for a certain app to this menu.
     * Note that this **will NOT add trigger** to menu.
     * menu.addCommand(app, alias1, alias2, ...)
     *
     * @param app instance of AppCommand
     * @param alias alias of the app
     * @memberof MenuCommand
     */
    addAlias(app: AppCommand<any>, ...aliases: string[]): void {
        if (!this.bot)
            throw new Error(
                'You must assign a bot to this menu before adding alias to apps.'
            );
        aliases.forEach((alias) => {
            this.appMap.set(alias, app);
            app.parent = this;
            app.assignBot(this.bot!);
        });
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
