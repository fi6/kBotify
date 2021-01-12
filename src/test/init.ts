// import { echoKmd } from 'test/echo/echo.kmd.app';
// import { echo } from 'test/echo/echo.menu';
import { KBotify } from 'utils/kbotify';
// import { echo } from "../commands/echo/echo.menu";

const kBot = new KBotify({
    key: 'key',
    mode: 'webhook',
    token: 'token',
    ignoreDecryptError: true,
    verifyToken: 'verifyToken',
});

// kBot.addCommand(echo);
// kBot.addCommand(echoKmd)

kBot.listen();


