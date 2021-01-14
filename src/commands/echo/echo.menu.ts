import { MenuCommand } from '../core/menu.command';

import { echoAll } from './echo.all.app';
import { echoKmd } from './echo.kmd.app';

class EchoMenu extends MenuCommand<any> {
    code = 'echo';
    trigger = 'echo';
    help = '目前只有`.echo kmd`一个指令。';
    intro = '复读菜单';
}

export const echoMenu = new EchoMenu(echoKmd, echoAll);
