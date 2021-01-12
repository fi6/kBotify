"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBot = void 0;
const echo_menu_1 = require("commands/echo/echo.menu");
const kaiheila_bot_root_1 = require("kaiheila-bot-root");
class KBot extends kaiheila_bot_root_1.KaiheilaBot {
    constructor(config) {
        super(config);
        this.commandMap = new Map();
        this.help = 'help for this bot.';
        this.botId = 'kaiheila user id for this bot.';
        this.addCommand = (command) => {
            command.bot = this;
            command.aliases.forEach((alias) => {
                this.commandMap.set(alias, command);
            });
        };
        this.execute = async (command, args, msg) => {
            const data = [command, args, msg];
            switch (command) {
                case 'echo':
                    return echo_menu_1.echo.exec(...data);
                default:
                    // eslint-disable-next-line no-case-declarations
                    const regex = /^[\u4e00-\u9fa5]/;
                    if (regex.test(command)) {
                        this.sendChannelMessage(1, msg.channelId, '不是有效的命令。查看帮助请发送[.帮助]');
                    }
                    break;
            }
        };
        this.on('message', (msg) => {
            const [command, ...args] = this.processMsg(msg);
            this.execute(command.toLowerCase(), args, msg);
        });
    }
    processMsg(msg) {
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
}
exports.KBot = KBot;
//# sourceMappingURL=setupBot.js.map