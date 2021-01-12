"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { echoKmd } from 'test/echo/echo.kmd.app';
// import { echo } from 'test/echo/echo.menu';
const KBot_1 = require("init/KBot");
// import { echo } from "../commands/echo/echo.menu";
const kBot = new KBot_1.KBotify({
    key: 'key',
    mode: 'webhook',
    token: 'token',
    ignoreDecryptError: true,
    verifyToken: 'verifyToken',
});
// kBot.addCommand(echo);
// kBot.addCommand(echoKmd)
kBot.listen();
//# sourceMappingURL=init.js.map