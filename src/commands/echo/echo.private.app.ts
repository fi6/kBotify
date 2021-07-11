import { AppCommand, AppFunc, BaseSession } from '../..';

class EchoPrivate extends AppCommand {
    code = 'pr';
    trigger = 'pr';
    help = '`.echo pr 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppFunc<BaseSession> = async session => {
        if (!session.args.length) {return session.reply(this.help); }

        return session._send(`${session.args}`);
    };
}

export const echoPrivate = new EchoPrivate();
