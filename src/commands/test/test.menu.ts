import { MenuCommand } from '../..';
import { testButton } from './test.button.app';

class TestMenu extends MenuCommand {
    code = 'test';
    trigger = 'test';
    help = '';
    intro = '复读菜单';
    menu = '发送.test button进行按钮测试';
    useCardMenu = false;
}

export const testMenu = new TestMenu(testButton);
