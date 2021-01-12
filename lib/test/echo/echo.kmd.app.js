"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("commands/shared/app");
class EchoKmd extends app_1.AppCommand {
    constructor() {
        super(...arguments);
        this.code = 'kmd';
        this.aliases = ['kmd'];
        this.help = '`.echo kmd 内容`';
        this.intro = '复读你所说的文字, 并用kmarkdown格式返回。';
        this.func = async (data) => {
            return this.msgSender.reply(`${data.args}`, data);
        };
    }
}
// export const echoKmd = new EchoKmd();
//# sourceMappingURL=echo.kmd.app.js.map