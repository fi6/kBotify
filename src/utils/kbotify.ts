import { AppCommand } from '../commands/core/app.command';
import { MenuCommand } from '../commands/core/menu.command';
import { BotConfig, KaiheilaBot } from 'kaiheila-bot-root';
import { KMarkDownMessage, TextMessage } from 'kaiheila-bot-root/dist/types';
import { BaseSession } from '../commands/core/session';

export class KBotify extends KaiheilaBot {
    commandMap = new Map<string, AppCommand<any> | MenuCommand<any>>();
    help = 'help for this bot.';
    botId: string | number = 'kaiheila user id for this bot.';
    constructor(config: BotConfig) {
        super(config);
        this.on('message', (msg) => {
            const res = this.processMsg(msg);
            if (!res) return;
            const [command, ...args] = res;
            this.execute(command.toLowerCase(), args, msg);
        });
    }
    /**
     * Process the msg object and generate [command, ...args]
     *
     * @param msg
     * @return string
     * @memberof KBotify
     */
    processMsg(msg: TextMessage | KMarkDownMessage): string[] | void {
        if (msg.content.startsWith('.') || msg.content.startsWith('。')) {
            // console.log(msg)
            return msg.content.slice(1).trim().split(/ +/);
        }
        if (msg.mention.user[0] == this.botId && msg.content.startsWith('@')) {
            const [, command, ...rest] = msg.content.trim().split(/ +/);
            return [command ? command.toLowerCase() : '', ...rest];
        }
    }

    /**
     * Add menu/app to this bot.
     *
     * @param commands array of instances of menu/app command
     * @memberof KBotify
     */
    addCommands = (
        ...commands: (MenuCommand<any> | AppCommand<any>)[]
    ): void => {
        for (const command of commands) {
            command.init(this);
            if (command instanceof MenuCommand) {
                for (const app of command.appMap.values()) {
                    app.init(this);
                }
            }
            this.commandMap.set(command.trigger, command);
        }
    };

    /**
     * Add alias for certain menu/app
     *
     * @param command instance of menu/app command
     * @param alias
     * @memberof KBotify
     */
    addAlias = (
        command: MenuCommand<any> | AppCommand<any>,
        ...aliases: string[]
    ): void => {
        command.init(this);
        if (command instanceof MenuCommand) {
            for (const app of command.appMap.values()) {
                app.init(this);
            }
        }
        aliases.forEach((alias) => {
            this.commandMap.set(alias, command);
        });
    };
    /**
     * Process the command.
     *
     * @param command
     * @param args
     * @param msg
     * @memberof KBotify
     */
    execute = async (
        command: string,
        args: string[],
        msg: TextMessage
    ): Promise<unknown> => {
        // const data: [string, string[], TextMessage] = [command, args, msg];
        const regex = /^[\u4e00-\u9fa5]/;
        const cmd = this.commandMap.get(command);

        if (cmd) return cmd.exec(new BaseSession(cmd, args, msg, this));

        if (regex.test(command)) {
            return this.sendChannelMessage(
                1,
                msg.channelId,
                '不是有效的命令。查看帮助请发送[.帮助]'
            );
        }
        return;
    };
}
