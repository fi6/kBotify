import { AppCommand, AppFunc } from '../..';

class EchoKmd extends AppCommand {
    code = 'kmd';
    trigger = 'kmd';
    help = '`.echo kmd 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppFunc = async (session) => {
        if (!session.args.length) {
            return session.reply(this.help);
        }

        return session.quote(`${session.args}`);
    };
}

export const echoKmd = new EchoKmd();
