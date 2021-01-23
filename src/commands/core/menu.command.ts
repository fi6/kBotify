import { TextMessage } from 'kaiheila-bot-root/dist/types';

import { AppCommand } from './app.command';
import { BaseCommand, ResultTypes, CommandTypes } from './types';
import { KBotify } from '../../utils/kbotify';
import { BaseData, FuncResult } from './app.types';
import { MsgSender } from './msg.sender';
import { BaseSession } from './session';

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
export abstract class MenuCommand<T extends BaseSession> implements BaseCommand {
    code = 'code';
    abstract trigger: string;
    help = 'help';
    menu = 'menu';
    appMap = new Map<string, AppCommand<any>>();
    msgSender = new MsgSender();
    bot: KBotify | undefined;
    useCardMenu = false;
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

    init = (bot: KBotify): void => {
        this.bot = bot;
        this.msgSender.init(bot);
        for (const app of this.appMap.values()) {
            app.init(bot);
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
                `You must init menu ${this.code} with a bot before adding alias to apps.`
            );
        aliases.forEach((alias) => {
            this.appMap.set(alias, app);
            app.parent = this;
            app.init(this.bot!);
        });
    }

    async func(session: BaseSession): Promise<ResultTypes | void> {
        const command = session.command;
        const args = session.args;
        const msg = session.msg;
        if (!command || args === undefined || !msg) {
            throw new Error(
                `command/args/msg is missing when exec MenuCommand ${this.code}.`
            );
        }
        try {
            if (!args.length) {
                if (this.useCardMenu)
                    this.msgSender.send(
                        this.menu,
                        session,
                        ResultTypes.SUCCESS,
                        { msgType: 10 }
                    );
                else this.msgSender.reply(this.menu, session);
                return ResultTypes.HELP;
            }
            if (args[0] === '帮助') {
                this.msgSender.reply(this.help, session);
            }

            session.cmdString = args.shift() as string;

            const app = this.appMap.get(session.cmdString);
            if (!app) {
                this.msgSender.reply(
                    '未找到对应命令。如需查看菜单请发送`.' +
                        `${this.trigger}` +
                        '`',
                    session
                );
                return ResultTypes.WRONG_ARGS;
            }
            return app.exec(session);
        } catch (err) {
            console.error(err);
        }
    }
    /**
     * If you want to have something done before executing app command, please overwrite this.
     *
     * @param session
     * @return {*}
     * @memberof MenuCommand
     */
    async exec(session: BaseSession): Promise<ResultTypes | void> {
        return this.func(session);
    }

    // defaultMessageSender = async <T extends BaseData>(
    //     result: FuncResult<T> | null,
    //     inputMsg?: TextMessage,
    //     inputContent?: string
    // ): Promise<FuncResult<T> | ResultTypes> => {
    //     let msg, content;
    //     if (!result?.returnData) {
    //         if (inputMsg && inputContent) {
    //             msg = inputMsg;
    //             content = inputContent;
    //         } else {
    //             throw new Error();
    //         }
    //     } else {
    //         msg = inputMsg ? inputMsg : result.returnData.msg;

    //         content = inputContent
    //             ? inputContent
    //             : (result.returnData.content as string);
    //     }

    //     if (!this.bot)
    //         throw new Error('Menu command used before bot assigned:');

    //     this.bot.sendChannelMessage(9, msg.channelId, content, msg.msgId);

    //     return result ? result.resultType : ResultTypes.SUCCESS;
    // };
}

export {};
