import { AppCommand, AppFunc, BaseSession, GuildSession } from '../..';

class EchoNext2 extends AppCommand {
    code = 'next';
    trigger = 'next2';
    help = '`.echo next2`';
    intro = '复读用户下次发送的全部文字';
    func: AppFunc<BaseSession> = async s => {
        const session = s as GuildSession;
        session.reply('将会复读下一次任意内容');
        const msg = await session.awaitMessage(/.+/, 1e4);
        if (msg) {
            return session.replyTemp(msg.content);
        } else {
            return session.replyTemp('没有输入');
        }
    };
}

export const echoNext2 = new EchoNext2();
