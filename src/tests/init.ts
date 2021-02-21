/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { KBotify } from '../utils/kbotify';
import * as dotenv from 'dotenv';
import { echoMenu } from '../commands/echo/echo.menu';
import { echoKmd } from '../commands/echo/echo.kmd.app';
import { KaiheilaBot } from 'kaiheila-bot-root';

dotenv.config();

const bot = new KBotify({
    mode: 'websocket',
    port: parseInt(process.env.KPORT!),
    token: process.env.TOKEN!,
    verifyToken: process.env.VERIFY,
    key: process.env.KEY,
    ignoreDecryptError: false,
});

bot.addCommands(echoMenu, echoKmd);

bot.on('rawEvent', (e) => {
    console.warn(`received:`, e);
});
// bot.addAlias(echoKmd, 'hello');

// bot.on('systemMessage', (msg) => {
//     console.debug(`system message! ${msg}`)
// })

bot.connect();

console.debug('system init success');
