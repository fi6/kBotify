import { BaseSession } from 'commands/core/session';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc, BaseData } from '../core/app.types';

class EchoNext extends AppCommand {
    code = 'next';
    trigger = 'next';
    help = '`.echo next`';
    intro = '复读用户下次发送的全部文字';
    func: AppCommandFunc<BaseSession> = async (session) => {
        session.setReplyTrigger('', 1e4, (msg) => session.send(msg.content));
        return session.reply('将会复读下一次任意内容');
    };
}

export const echoNext = new EchoNext();
