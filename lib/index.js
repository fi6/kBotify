"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuCommand = exports.AppCommand = exports.KBotify = void 0;
const app_1 = require("./commands/shared/app");
Object.defineProperty(exports, "AppCommand", { enumerable: true, get: function () { return app_1.AppCommand; } });
const menu_1 = require("./commands/shared/menu");
Object.defineProperty(exports, "MenuCommand", { enumerable: true, get: function () { return menu_1.MenuCommand; } });
const KBot_1 = require("./init/KBot");
Object.defineProperty(exports, "KBotify", { enumerable: true, get: function () { return KBot_1.KBotify; } });
const init_1 = require("./test/init");
init_1.kBot.once('rawEvent', (msg) => {
    console.debug(msg);
});
//# sourceMappingURL=index.js.map