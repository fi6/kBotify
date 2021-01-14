# kBotify
基于botRoot的开黑啦Bot开发框架

## 重要提醒
**如果你的当前版本低于0.1.3，请尽快升级，0.1.3版本改动中将BaseData替换为了BaseSession，可能会造成一定兼容性问题。**

## 更新历史
### 0.1.3
- 替换BaseData为BaseSession，简化了消息回复流程，增加对一次性文字trigger的支持。

## TODO
- [ ] 文档
- [ ] 精简不必要的代码
- [ ] 自动生成Menu
- [ ] 增加context
- [ ] 增加匹配模式：命令匹配/前缀匹配（如：直接匹配 .房间 创建，而不是先匹配.房间再匹配创建）

## 简单说明
请善用ts的自动补全。
### 结构
Bot
- Menu/App
  - Menu/App
  - ...

### Bot用法

**当前仅支持用"." "。"和@机器人 三种开头方式。未来考虑增加多种前缀，但是为了方便统一前缀，这里可能不会做修改，需要大家自行修改。**
`bot.processMsg=()=>{}`

生成Bot
```ts
const bot = new KBotify({
    mode: 'webhook',
    port: 12345,
    token: 'your kaiheila token',
    verifyToken: 'your kaiheila verify token',
    key: 'your kaiheila encrypt key',
    ignoreDecryptError: false, // 如果需要可以改为true
});
```

添加Command
```ts
bot.addCommands(echoMenu, echoKmd)
```

添加Alias
```ts
bot.addAlias(echoMenu, '复读', '重复')
```

启动Bot
```ts
bot.listen()
```

### Menu/App用法

```ts
import { MenuCommand } from 'commands/shared/menu';
import { BaseData } from 'commands/shared/types';
import { echoKmd } from './echo.kmd.app';

class EchoMenu extends MenuCommand<BaseSession> {
    code = 'echo';
    trigger = 'echo';
    help = '目前只有`.echo kmd`一个指令。';
    intro = '复读菜单';
}

export const echoMenu = new EchoMenu(echoKmd);
echoMenu.addAlias(echoKmd, 'kmarkdown'， '富文本')
```

```ts
import { AppCommand } from 'commands/shared/app';
import { AppCommandFunc } from 'commands/shared/app.types';
import { BaseData } from 'commands/shared/types';

class EchoAll extends AppCommand<BaseSession> {
    code = 'all';
    trigger = 'all';
    help = '`.echo all 时间`';
    intro = '在指定时间内复读全部文字';
    func: AppCommandFunc<BaseSession> = async (session) => {
        session.setReplyTrigger('', 6e4, (msg) =>
            session.sendOnly(msg.content)
        );
        return this.msgSender.reply('将会复读下一次任意内容，1min有效', session);
    };
}

export const echoAll = new EchoAll();
```

特别感谢：树根
本项目基于BotRoot开发
https://github.com/shugen002/BotRoot