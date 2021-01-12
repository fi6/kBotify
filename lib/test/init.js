"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kBot = void 0;
const KBot_1 = require("init/KBot");
const echo_menu_1 = require("../commands/echo/echo.menu");
const kBot = new KBot_1.KBotify({
    mode: 'webhook',
    token: 'your token',
    ignoreDecryptError: true,
});
exports.kBot = kBot;
kBot.addCommand(echo_menu_1.echo);
kBot.listen();
//# sourceMappingURL=init.js.map