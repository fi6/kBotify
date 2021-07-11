import { Card, CardObject } from '../card';
import { KBotify } from '../kbotify';
import { log } from '../logger';
import { BaseSession, GuildSession } from '../session';
import { BaseCommand, CommandTypes, ResultTypes } from '../types';
import { AppCommand } from './command.app';

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
export abstract class MenuCommand implements BaseCommand {
    code = 'code';
    /**
     * 菜单触发文字
     */
    abstract trigger: string;
    /**
     * 帮助文字。当发送`(菜单触发文字) 帮助`时返回的提示。
     */
    help = 'help';
    /**
     * 菜单文字。如果设置useCardMenu=true，此处应为json样式的字符串。
     */
    menu: string | CardObject[] = [new Card().addText('menu card')];
    commandMap = new Map<string, AppCommand>();
    /**
     * 此命令绑定的bot实例
     */
    client: KBotify | undefined;
    /**
     * 是否使用cardmessage作为菜单，默认为否。如果为是，则菜单文字内容必须为cardmessage。
     */
    useCardMenu = true;
    useTempMenu = true;
    readonly type = CommandTypes.MENU;

    /**
     * Creates an instance of MenuCommand.
     * this will add trigger of the app to the menu.
     *
     * @param apps instances of AppCommand
     * @memberof MenuCommand
     */
    constructor(...apps: AppCommand[]) {
        apps.forEach(app => {
            this.commandMap.set(app.trigger, app);
            app.parent = this;
        });
        if (!this.useCardMenu && typeof this.menu !== 'string') {throw new Error('using text menu with non-string menu'); }
    }

    init = (client: KBotify): void => {
        this.client = client;
        for (const app of this.commandMap.values()) {
            app.init(client);
        }
    };

    /**
     * Add alias for a certain app to this menu.
     * 与初始化菜单时添加App不同，不会添加App的触发文字到菜单内，只添加作为参数输入的Alias。
     * Note that this **will NOT add trigger** to menu.
     * menu.addCommand(app, alias1, alias2, ...)
     *
     * @param app instance of AppCommand
     * @param alias alias of the app
     * @memberof MenuCommand
     */
    addAlias(app: AppCommand, ...aliases: string[]): void {
        if (!this.client) {throw new Error(
                `You must init menu ${this.code} with a bot before adding alias to apps.`
            ); }
        aliases.forEach(alias => {
            this.commandMap.set(alias, app);
            app.parent = this;
            app.init(this.client!);
        });
    }

    /**
     * 菜单的主体功能。
     * - 如果参数为空，返回菜单。
     * - 如果第一个参数为帮助，返回帮助。
     * - 如果未找到对应命令，返回如何触发菜单的提示。
     * - 如果找到对应命令，则调用。
     *
     * @param {BaseSession} session
     * @return {*}  {(Promise<ResultTypes | void>)}
     * @memberof MenuCommand
     */
    async func(session: BaseSession): Promise<ResultTypes | void> {
        const command = session.command;
        const args = session.args;
        const msg = session.msg;
        if (!command || args === undefined || !msg) {
            throw new Error(
                `command/args/msg is missing when exec MenuCommand ${this.code}.`
            );
        }
        if (session.msg.guildId) {
            try {
                session = await GuildSession.fromSession(session, false);
            } catch (error) {
                log.error('Error when getting guild session', session);
            }
        }
        try {
            if (!args.length) {
                if (!this.useCardMenu) {
                    const result = this.useTempMenu
                        ? session.sendTemp(this.menu as string)
                        : session.send(this.menu as string);
                } else {
                    const result = this.useTempMenu
                        ? session.sendCardTemp(this.menu)
                        : session.sendCard(this.menu);
                }

                return ResultTypes.HELP;
            }
            if (args[0] === '帮助') {
                session.reply(this.help);

                return ResultTypes.HELP;
            }

            session.cmdString = args.shift() as string;

            const app = this.commandMap.get(session.cmdString);
            if (!app) {
                session.reply(
                    '未找到对应命令。如需查看菜单请发送`.' +
                        `${this.trigger}` +
                        '`'
                );

                return ResultTypes.WRONG_ARGS;
            }

            return app.exec(session);
        } catch (err) {
            log.error(err);
        }
    }

    /**
     * If you want to have something done before executing app command, please overwrite this.
     * 默认情况下直接调用菜单的func功能。
     *
     * @param session
     * @return {*}
     * @memberof MenuCommand
     */
    async exec(session: BaseSession): Promise<ResultTypes | void> {
        return this.func(session);
    }
}
