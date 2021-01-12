"use strict";
// import auth from '../configs/auth';
// import { TextMessage } from 'kaiheila-bot-root/dist/types';
// import { CommandInput } from 'commands/shared/command.types';
// import { KaiheilaBot } from 'kaiheila-bot-root';
// import { dqPing } from 'commands/dqping/dqping.app';
// import accountMenu from 'commands/account/account.menu';
// const bot = new KaiheilaBot({
//     mode: 'webhook',
//     port: 20600,
//     key: auth.khlkey,
//     token: auth.khltoken,
//     verifyToken: auth.khlverify,
//     ignoreDecryptError: false,
// });
// bot.listen();
// // bot.on('rawEvent', (e)=>{
// //     console.log(e);
// // })
// bot.on('message', (msg) => {
//     if (msg.content.startsWith('.') || msg.content.startsWith('。')) {
//         // console.log(msg)
//         const args = msg.content.slice(1).trim().split(/ +/);
//         const command = args.shift().toLowerCase();
//         execute(command, args, msg);
//     }
// });
// async function execute(command: string, args: string[], msg: TextMessage) {
//     const data: CommandInput = [command, args, msg];
//     switch (command) {
//         case 'dqping':
//             dqPing.exec(...data);
//             break;
//         case '签到':
//             // playerCheckin(msg);
//             break;
//         case '账户':
//             accountMenu.exec(command, args, msg);
//             break;
//         default:
//             // eslint-disable-next-line no-case-declarations
//             const regex = /^[\u4e00-\u9fa5]/;
//             if (regex.test(command)) {
//                 bot.sendChannelMessage(
//                     1,
//                     msg.channelId,
//                     '不是有效的命令。查看帮助请发送[.帮助]'
//                 );
//             }
//             break;
//     }
//     // console.log(command, args)
// }
// export default bot;
//# sourceMappingURL=bot_init.js.map