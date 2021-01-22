import { MenuCommand } from '../core/menu.command';

import { echoAll } from './echo.all.app';
import { echoKmd } from './echo.kmd.app';

class EchoMenu extends MenuCommand<any> {
    code = 'echo';
    trigger = 'echo';
    help = '如需测试KMarkDown请发送".echo kmd", 测试CardMessage请发送".echo card"';
    intro = '复读菜单';
}

export const echoMenu = new EchoMenu(echoKmd, echoAll);
