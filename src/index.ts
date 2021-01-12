import { AppCommand } from './commands/shared/app';
import { MenuCommand } from './commands/shared/menu';
import { KBotify } from './init/KBot';
import { BaseData } from './commands/shared/types';
import { AppCommandFunc } from './commands/shared/app.types';
import { kBot } from './test/init';

kBot.once('rawEvent', (msg) => {
    console.debug(msg);
});

export { KBotify , AppCommand, MenuCommand, AppCommandFunc, BaseData };
