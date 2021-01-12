import { AppCommand } from 'commands/shared/command.app';
import { AppCommandFunc } from 'commands/shared/command.app.types';
import { MenuCommand } from 'commands/shared/command.menu';
import { BaseData } from 'commands/shared/command.types';
import { echoKmd } from './echo.kmd.app';

class Echo extends MenuCommand<BaseData> {
    code = 'echo';
    aliases = ['echo'];
    help = '目前只有`.echo kmd`一个指令。';
    intro = '复读菜单';

}

export const echo = new Echo(echoKmd);