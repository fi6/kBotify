import { BaseSession } from 'commands/core/session';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc } from '../core/app.types';

class EchoPrivate extends AppCommand {
    code = 'pr';
    trigger = 'pr';
    help = '`.echo pr 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppCommandFunc<BaseSession> = async (session) => {
        if (!session.args.length) return session.reply(this.help);
        return session._send(`${session.args}`);
    };
}

export const echoPrivate = new EchoPrivate();
