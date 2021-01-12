"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.echo = void 0;
const command_menu_1 = require("commands/shared/command.menu");
const echo_kmd_app_1 = require("./echo.kmd.app");
class Echo extends command_menu_1.MenuCommand {
    constructor() {
        super(...arguments);
        this.code = 'echo';
        this.aliases = ['echo'];
        this.help = '目前只有`.echo kmd`一个指令。';
        this.intro = '复读菜单';
    }
}
exports.echo = new Echo(echo_kmd_app_1.echoKmd);
//# sourceMappingURL=echo.menu.js.map