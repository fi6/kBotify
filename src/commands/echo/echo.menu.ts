import { MenuCommand } from 'commands/shared/menu';
import { BaseData } from 'commands/shared/types';
import { echoKmd } from './echo.kmd.app';

class Echo extends MenuCommand<BaseData> {
    code = 'echo';
    aliases = ['echo'];
    help = '目前只有`.echo kmd`一个指令。';
    intro = '复读菜单';
}

export const echo = new Echo(echoKmd);