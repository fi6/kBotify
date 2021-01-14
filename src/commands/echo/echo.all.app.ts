import { BaseSession } from 'commands/core/session';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc, BaseData } from '../core/app.types';

class EchoAll extends AppCommand<BaseSession> {
    code = 'all';
    trigger = 'all';
    help = '`.echo all 时间`';
    intro = '在指定时间内复读全部文字';
    func: AppCommandFunc<BaseSession> = async (session) => {
        session.setReplyTrigger('', 1e4, (msg) =>
            session.sendOnly(msg.content)
        );
        return this.msgSender.reply('将会复读下一次任意内容', session);
    };
}

export const echoAll = new EchoAll();
