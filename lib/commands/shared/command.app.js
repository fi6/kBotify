"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCommand = exports.initFuncResult = void 0;
const setupBot_1 = require("init/setupBot");
const mention_by_id_1 = require("../../utils/mention-by-id");
const command_msg_1 = require("./command.msg");
const command_types_1 = require("./command.types");
function initFuncResult(data, resultType, msgSent) {
    const funcResult = {
        returnData: data,
        resultType: resultType ? resultType : command_types_1.ResultTypes.PENDING,
        msgSent: msgSent,
    };
    return funcResult;
}
exports.initFuncResult = initFuncResult;
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
class AppCommand {
    constructor() {
        this.code = 'code';
        this.aliases = ['alias'];
        this.help = 'help';
        this.intro = 'intro';
        this.bot = new setupBot_1.KBot({
            mode: 'webhook',
            token: 'token',
            ignoreDecryptError: true,
        });
        this.func = async (_data) => {
            throw new Error(`${this.code}的func尚未定义`);
        };
        this.msgSender = new command_msg_1.AppMsgSender();
        this.type = command_types_1.CommandTypes.APP;
    }
    async exec(command, args, msg) {
        console.debug('running command: ', command, args, msg);
        try {
            if (args[0] === '帮助') {
                this.bot.sendChannelMessage(9, msg.channelId, `${mention_by_id_1.mentionById(msg.authorId)}` + this.help, msg.msgId);
                return command_types_1.ResultTypes.HELP;
            }
            const data = {
                cmdCode: this.code,
                cmdString: command,
                args: args,
                msg: msg,
            };
            const result = await this.func(data);
            if (typeof result === 'string')
                return result;
            return result.resultType;
        }
        catch (error) {
            console.error(error);
            return command_types_1.ResultTypes.ERROR;
        }
    }
}
exports.AppCommand = AppCommand;
//# sourceMappingURL=command.app.js.map