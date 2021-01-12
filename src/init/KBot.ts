import { AppCommand } from '../commands/shared/app';
import { MenuCommand } from '../commands/shared/menu';
import { BotConfig, KaiheilaBot } from 'kaiheila-bot-root';
import { KMarkDownMessage, TextMessage } from 'kaiheila-bot-root/dist/types';

export class KBotify extends KaiheilaBot {
    commandMap = new Map<string, AppCommand<any> | MenuCommand<any>>();
    help = 'help for this bot.';
    botId = 'kaiheila user id for this bot.';
    constructor(config: BotConfig) {
        super(config);
        this.on('message', (msg) => {
            const [command, ...args] = this.processMsg(msg);
            this.execute(command.toLowerCase(), args, msg);
        });
    }

    private processMsg(msg: TextMessage | KMarkDownMessage): string[] {
        if (msg.content.startsWith('.') || msg.content.startsWith('。')) {
            // console.log(msg)
            return msg.content.slice(1).trim().split(/ +/);
        }
        if (msg.mention.user[0] === this.botId && msg.content.startsWith('@')) {
            const [, ...rest] = msg.content.trim().split(/ +/);
            return rest;
        }
        return [''];
    }
    addCommand = (command: AppCommand<any> | MenuCommand<any>): void => {
        command.bot = this;

        command.aliases.forEach((alias) => {
            this.commandMap.set(alias, command);
        });
    };

    execute = async (command: string, args: string[], msg: TextMessage) => {
        // const data: [string, string[], TextMessage] = [command, args, msg];
        const regex = /^[\u4e00-\u9fa5]/;
        const cmd = this.commandMap.get(command);
        if (cmd) return cmd.exec(command, args, msg);
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
