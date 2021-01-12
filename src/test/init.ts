import { echo } from "commands/echo/echo.menu";
import { KBot } from "index";

const kBot = new KBot({
    mode: 'webhook',
    token: 'your token',
    ignoreDecryptError: true,
});

kBot.addCommand(echo);
