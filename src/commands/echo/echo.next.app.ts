import { AppCommand, AppFunc, BaseSession } from '../..';

class EchoNext extends AppCommand {
    code = 'next';
    trigger = 'next';
    help = '`.echo next`';
    intro = '复读用户下次发送的全部文字';
    func: AppFunc<BaseSession> = async (session) => {
        session.setTextTrigger('', 1e4, (msg) => session.send(msg.content));
        return session.reply('将会复读下一次任意内容');
    };
}

export const echoNext = new EchoNext();
