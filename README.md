# kBotify

[![npm version](https://badge.fury.io/js/kbotify.svg)](https://www.npmjs.com/package/kbotify)

基于 [BotRoot](https://github.com/shugen002/BotRoot) 的 JavaScript / TypeScript 开黑啦 Bot 开发框架。

## 优势

-   强大的交互功能，让你轻松完成各种需要大量交互的复杂功能。
-   完善的 API，稳定的迭代，让你专注开发，无需操心 SDK。
-   同时拥有 SDK 与命令框架模式，一行代码也能写 Bot。

## 快速开始

### 一个简单的示例

```ts
import { KBotify } from 'kbotify';

const bot = new KBotify({
    mode: 'webhook', // Webhook 模式
    port: 12345, // 回调监听端口
    token: 'your token',
    verifyToken: 'your verify token',
    key: 'your encrypt key',
    ignoreDecryptError: false, // 是否忽略消息解密错误 如果需要可以改为true
});

bot.connect(); // 启动 Bot
```

### 从模板开始

你也可以使用[仓库模板](https://github.com/fi6/kBotify-template)  
参考其中的 src/commands/echo 文件夹即可。修改 src/configs 文件夹下 template-auth.ts 中的内容，并重命名为 auth.ts 即可开始使用。  
可参考[文档链接](https://fi6.github.io/kBotify/)

## TODO

-   [x] 文档
-   [x] 精简不必要的代码
-   [ ] 自动生成 Menu
-   [ ] 增加命令速率限制（全局，服务器，频道，角色，用户）
-   [ ] session 增加 context
-   [ ] 增加匹配模式：命令匹配/前缀匹配（如：直接匹配 .房间 创建，而不是先匹配.房间再匹配创建）
-   [ ] 增加 test
-   [ ] 插件化
-   [ ] aws lambda 接口

### Bot 使用方法

**当前仅支持用"." "。"和@机器人 三种开头方式。未来考虑增加多种前缀，但是为了方便统一前缀，这里可能不会做修改，需要大家自行修改。**
`bot.processMsg=()=>{}`

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

可以使用官方提供的[卡片消息编辑器](https://www.kaiheila.cn/tools/message-builder.html#/card)

完成编辑后，复制右侧自动生成的代码，然后把每张卡片使用`const cardObject = new Card({...这里是卡片的内容})`进行生成即可，发送的时候使用`session.sendCard(cardObject)`或`session.sendCardTemp(cardObject)`进行发送。

你也可以直接复制自动生成的代码，使用`session.sendCard([cardObjects])`进行发送，具体可参考 src/commands 文件夹下的示例。

## 更新历史

### 0.2.10

-   更新了文档
-   不再强制需要对 Command 使用泛型，减少开发成本
-   发送卡片消息时可以手动指定@、引用等选项了
-   优化了代码结构，补充了部分 API 接口

### 0.2.3

-   可以直接在 `update message` 中使用 `card` 了
-   将 `\_botInstance` 重命名为 `client`，增加了 `deprecate` 标志
-   `Card.toString()` 增加了选项，可以输出带有方括号或无方括号的 string。

### 0.2.1

-   更新了少量 API，`0.2.2` 版本将会覆盖 99% API
-   增加了 `class Card`，废弃了之前使用 `parser` 的模式，提供更好的卡片消息操作性能。
-   增加了 `GuildSession.awaitMessage`，允许开发者等待用户在当前频道的下一条消息。
-   增加了 `collecter`，允许开发者在一定时间内收集频道内的消息，并且自定义停止的 trigger。
-   解决了由于 pr#5 带来的 `mention`、`reply` 错误

### 0.1.3

-   替换 `BaseData` 为 `BaseSession`，简化了消息回复流程，增加对一次性文字 trigger 的支持。

---

特别感谢：[树根](https://github.com/shugen002)
本项目基于 [BotRoot](https://github.com/shugen002/BotRoot) 开发
