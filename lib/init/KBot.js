"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KBotify = void 0;
const menu_1 = require("../commands/shared/menu");
const kaiheila_bot_root_1 = require("kaiheila-bot-root");
class KBotify extends kaiheila_bot_root_1.KaiheilaBot {
    constructor(config) {
        super(config);
        this.commandMap = new Map();
        this.help = 'help for this bot.';
        this.botId = 'kaiheila user id for this bot.';
        this.addCommand = (command) => {
            command.assignBot(this);
            if (command instanceof menu_1.MenuCommand) {
                for (const app of command.appMap.values()) {
                    app.assignBot(this);
                }
            }
            command.aliases.forEach((alias) => {
                this.commandMap.set(alias, command);
            });
        };
        this.execute = async (command, args, msg) => {
            // const data: [string, string[], TextMessage] = [command, args, msg];
            const regex = /^[\u4e00-\u9fa5]/;
            const cmd = this.commandMap.get(command);
            if (cmd)
                return cmd.exec(command, args, msg);
            if (regex.test(command)) {
                return this.sendChannelMessage(1, msg.channelId, '不是有效的命令。查看帮助请发送[.帮助]');
            }
            return;
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
exports.KBotify = KBotify;
//# sourceMappingURL=KBot.js.map