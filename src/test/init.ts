import { echoKmd } from 'commands/echo/echo.kmd.app';
import { echo } from 'commands/echo/echo.menu';
import { KBotify } from 'init/KBot';
// import { echo } from "../commands/echo/echo.menu";

const kBot = new KBotify({
    mode: 'webhook',
    token: 'your token',
    ignoreDecryptError: true,
});

kBot.addCommand(echo);
// kBot.addCommand(echoKmd)

kBot.listen();

export { kBot };
