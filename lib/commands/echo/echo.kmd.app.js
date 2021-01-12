"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echoKmd = void 0;
const command_app_1 = require("commands/shared/command.app");
class EchoKmd extends command_app_1.AppCommand {
    constructor() {
        super(...arguments);
        this.code = 'kmd';
        this.aliases = ['kmd'];
        this.help = '`.echo kmd 内容`';
        this.intro = '复读你所说的文字, 并用kmarkdown格式返回。';
        this.func = async (data) => {
            return this.msgSender.reply(data.msg.content, data);
        };
    }
}
exports.echoKmd = new EchoKmd();
//# sourceMappingURL=echo.kmd.app.js.map