import { MenuCommand } from '../..';
import { testButton } from './test.button.app';
import { testPrivate } from './test.private.app';
import { testUpdate } from './test.update.app';

class TestMenu extends MenuCommand {
    code = 'test';
    trigger = 'test';
    help = '';
    menu = '发送.test button进行按钮测试';
    useCardMenu = false;
}

export const testMenu = new TestMenu(testPrivate, testButton, testUpdate);
