import { BaseSession } from 'commands/core/session';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc, BaseData } from '../core/app.types';

class EchoAll extends AppCommand {
    code = 'all';
    trigger = 'all';
    help = '`.echo all 时间`';
    intro = '在指定时间内复读全部文字';
    func: AppCommandFunc<BaseSession> = async (session) => {
        session.setReplyTrigger('', 1e4, (msg) =>
            session.sendOnly(msg.content)
        );
        return session.reply('将会复读下一次任意内容');
    };
}

export const echoAll = new EchoAll();
