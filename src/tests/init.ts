/* eslint-disable @typescript-eslint/no-non-null-assertion */

import * as dotenv from 'dotenv';
import { echoMenu } from '../commands/echo/echo.menu';
import { echoKmd } from '../commands/echo/echo.kmd.app';
import { testMenu } from '../commands/test/test.menu';
import { KaiheilaBot } from 'kaiheila-bot-root';
import { KBotify } from '..';

dotenv.config();

const bot = new KBotify({
    mode: 'websocket',
    port: parseInt(process.env.KPORT!),
    token: process.env.TOKEN!,
    verifyToken: process.env.VERIFY,
    key: process.env.KEY,
    ignoreDecryptError: false,
});

bot.addCommands(echoMenu, echoKmd, testMenu);

bot.messageSource.on('message', (e) => {
    console.debug(`received:`, e);
});

// bot.addAlias(echoKmd, 'hello');

// bot.on('systemMessage', (msg) => {
//     console.debug(`system message! ${msg}`)
// })

bot.connect();

console.debug('system init success');
