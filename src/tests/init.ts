/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { KBotify } from '../utils/kbotify';
import * as dotenv from 'dotenv';
import { echoMenu } from '../commands/echo/echo.menu';
import { echoKmd } from '../commands/echo/echo.kmd.app';

dotenv.config();

const bot = new KBotify({
    mode: 'webhook',
    port: parseInt(process.env.KPORT!),
    token: process.env.TOKEN!,
    verifyToken: process.env.VERIFY,
    key: process.env.KEY,
    ignoreDecryptError: false,
});

bot.addCommands(echoMenu, echoKmd)

bot.addAlias(echoKmd, 'hello')

bot.listen()
