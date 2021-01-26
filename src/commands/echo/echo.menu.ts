import { MenuCommand } from '../core/menu.command';

import { echoAll } from './echo.all.app';
import { echoCard } from './echo.card.app';
import { echoKmd } from './echo.kmd.app';

class EchoMenu extends MenuCommand<any> {
    code = 'echo';
    trigger = 'echo';
    help =
        '如需测试KMarkDown请发送".echo kmd", 测试CardMessage请发送".echo card"';
    intro = '复读菜单';
    menu = menu;
    useCardMenu = true;
}

const menu = `[
  {
    "type": "card",
    "theme": "secondary",
    "size": "lg",
    "modules": [
      {
        "type": "action-group",
        "elements": [
          {
            "type": "button",
            "theme": "primary",
            "value": "echo kmd",
            "text": {
              "type": "plain-text",
              "content": "KMarkDown"
            }
          },
          {
            "type": "button",
            "theme": "primary",
            "value": "echo card",
            "text": {
              "type": "plain-text",
              "content": "卡片消息"
            }
          }
        ]
      }
    ]
  }
]`;

export const echoMenu = new EchoMenu(echoKmd, echoCard, echoAll);
