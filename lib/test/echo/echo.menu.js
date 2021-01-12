"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menu_1 = require("commands/shared/menu");
// import { echoKmd } from './echo.kmd.app';
class Echo extends menu_1.MenuCommand {
    constructor() {
        super(...arguments);
        this.code = 'echo';
        this.aliases = ['echo'];
        this.help = '目前只有`.echo kmd`一个指令。';
        this.intro = '复读菜单';
    }
}
// export const echo = new Echo(echoKmd);
//# sourceMappingURL=echo.menu.js.map