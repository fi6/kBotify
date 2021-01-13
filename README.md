# kBotify
基于botRoot的开黑啦Bot开发框架

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
bot.addCommands(echoMenu, '复读')
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

class EchoMenu extends MenuCommand<BaseData> {
    code = 'echo';
    trigger = 'echo';
    help = '目前只有`.echo kmd`一个指令。';
    intro = '复读菜单';
}

export const echoMenu = new EchoMenu(echoKmd);
```

```ts
import { AppCommand } from 'commands/shared/app';
import { AppCommandFunc } from 'commands/shared/app.types';
import { BaseData } from 'commands/shared/types';

class EchoKmd extends AppCommand<BaseData> {
    code = 'kmd';
    trigger = 'kmd';
    help = '`.echo kmd 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppCommandFunc<BaseData> = async (data) => {
        return this.msgSender.reply(`${data.args}`, data);
    };
}

export const echoKmd = new EchoKmd();
```



## TODO
- [ ] 文档
- [ ] 精简不必要的代码
- [ ] 自动生成Menu
- [ ] 增加context··