import { BaseSession } from 'commands/core/session';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc } from '../core/app.types';

class EchoPrivate extends AppCommand<BaseSession> {
    code = 'pr';
    trigger = 'pr';
    help = '`.echo pr 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppCommandFunc<BaseSession> = async (session) => {
        if (!session.args.length) return session.reply(this.help, true);
        return session.sendOnly(`${session.args}`, true);
    };
}

export const echoPrivate = new EchoPrivate();
