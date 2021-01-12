"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuCommand = void 0;
const types_1 = require("./types");
/**
 * Class of menu command.
 * You should initialize with params: code, aliases, help, apps(array of AppCommand).
 *
 * @export
 * @class MenuCommand
 * @template T
 */
class MenuCommand {
    constructor(...apps) {
        this.code = 'code';
        this.aliases = ['alias'];
        this.help = 'help';
        this.appMap = new Map();
        this.type = types_1.CommandTypes.MENU;
        this.assignBot = (bot) => {
            this.bot = bot;
        };
        this.defaultMessageSender = async (result, inputMsg, inputContent) => {
            let msg, content;
            if (!(result === null || result === void 0 ? void 0 : result.returnData)) {
                if (inputMsg && inputContent) {
                    msg = inputMsg;
                    content = inputContent;
                }
                else {
                    throw new Error();
                }
            }
            else {
                msg = inputMsg ? inputMsg : result.returnData.msg;
                content = inputContent
                    ? inputContent
                    : result.returnData.content;
            }
            if (!this.bot)
                throw new Error('Menu command used before bot assigned:');
            this.bot.sendChannelMessage(9, msg.channelId, content, msg.msgId);
            return result ? result.resultType : types_1.ResultTypes.SUCCESS;
        };
        apps.forEach((app) => {
            app.aliases.forEach((alias) => {
                this.appMap.set(alias, app);
                app.parent = this;
            });
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
    async exec(command, args, msg) {
        if (!command || args === undefined || !msg) {
            throw new Error(`command/args/msg is missing when exec MenuCommand ${this.code}.`);
        }
        try {
            if (!args.length) {
                this.defaultMessageSender(null, msg, this.help);
                return types_1.ResultTypes.HELP;
            }
            command = args.shift();
            const app = this.appMap.get(command);
            if (!app) {
                this.defaultMessageSender(null, msg, '未找到对应命令。如需查看菜单请发送`.' +
                    `${this.aliases[0]}` +
                    '`');
                return types_1.ResultTypes.WRONG_ARGS;
            }
            return app.exec(command, args, msg);
        }
        catch (error) {
            console.error(error);
            return types_1.ResultTypes.ERROR;
        }
    }
}
exports.MenuCommand = MenuCommand;
//# sourceMappingURL=menu.js.map