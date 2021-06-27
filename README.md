# kBotify

基于 botRoot 的开黑啦 Bot 开发框架

## 重要提醒

**如果你的当前版本低于 0.1.3，请尽快升级，0.1.3 版本改动中将 BaseData 替换为了 BaseSession，可能会造成一定兼容性问题。**

## 更新历史

### 0.2.1

-   更新了少量 API，0.2.2 版本将会覆盖 99%API
-   增加了`class Card`，废弃了之前使用 parser 的模式，提供更好的卡片消息操作性能。
-   增加了`GuildSession.awaitMessage`，允许开发者等待用户在当前频道的下一条消息。
-   增加了`collecter`，允许开发者在一定时间内收集频道内的消息，并且自定义停止的 trigger。
-   解决了由于 pr#5 带来的 mention、reply 错误的问题

### 0.1.3

-   替换 BaseData 为 BaseSession，简化了消息回复流程，增加对一次性文字 trigger 的支持。

## TODO

-   [ ] 文档
-   [ ] 精简不必要的代码
-   [ ] 自动生成 Menu
-   [ ] session 增加 context
-   [ ] 增加匹配模式：命令匹配/前缀匹配（如：直接匹配 .房间 创建，而不是先匹配.房间再匹配创建）

## 简单说明

请善用 ts 的自动补全。

### 结构

Bot

-   Menu/App
    -   Menu/App
    -   ...

### Bot 用法

**当前仅支持用"." "。"和@机器人 三种开头方式。未来考虑增加多种前缀，但是为了方便统一前缀，这里可能不会做修改，需要大家自行修改。**
`bot.processMsg=()=>{}`

生成 Bot

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

添加 Command

```ts
bot.addCommands(echoMenu, echoKmd);
```

添加 Alias

```ts
bot.addAlias(echoMenu, '复读', '重复');
```

启动 Bot

```ts
bot.connect();
```

### SDK 使用方法

```ts
bot.message.on('text', (msg) => {});
bot.event.on('system', (event) => {});
```

### Menu/App 使用方法

请查看 src/commands 下的示例。

```ts
import { MenuCommand } from 'commands/shared/menu';
import { BaseData } from 'commands/shared/types';
import { echoKmd } from './echo.kmd.app';

class EchoMenu extends MenuCommand {
    code = 'echo';
    trigger = 'echo';
    help = '目前只有`.echo kmd`一个指令。';
    intro = '复读菜单';
}

export const echoMenu = new EchoMenu(echoKmd);
echoMenu.addAlias(echoKmd, 'kmarkdown', '富文本');
```

```ts
import { AppCommand } from 'commands/shared/app';
import { AppFunc } from 'commands/shared/app.types';
import { BaseData } from 'commands/shared/types';

class EchoAll extends AppCommand {
    code = 'all';
    trigger = 'all';
    help = '`.echo all 时间`';
    intro = '在指定时间内复读全部文字';
    func: AppFunc<BaseSession> = async (session) => {
        session.setTextTrigger('', 6e4, (msg) => session.sendOnly(msg.content));
        return session.reply('将会复读下一次任意内容，1min有效', session);
    };
}

export const echoAll = new EchoAll();
```

### 卡片消息相关

官方提供的卡片消息编辑器：[点击使用](https://www.kaiheila.cn/tools/message-builder.html#/card)

完成编辑后，复制右侧自动生成的代码，然后把每张卡片使用`const cardObject = new Card({...这里是卡片的内容})`进行生成即可，发送的时候使用`session.sendCard(cardObject)`或`session.sendCardTemp(cardObject)`进行发送。

你也可以直接复制自动生成的代码，使用`session.sendCard([cardObjects])`进行发送，具体可参考 src/commands 文件夹下的示例。

---

特别感谢：树根
本项目基于 BotRoot 开发
https://github.com/shugen002/BotRoot
