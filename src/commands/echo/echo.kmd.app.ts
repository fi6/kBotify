<<<<<<< HEAD
import { AppCommand, AppFunc, BaseSession } from '../..';
=======
import { BaseSession } from 'commands/core/session';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc } from '../core/app.types';
>>>>>>> origin/main

class EchoKmd extends AppCommand {
    code = 'kmd';
    trigger = 'kmd';
    help = '`.echo kmd 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
<<<<<<< HEAD
    func: AppFunc<BaseSession> = async (session) => {
        if (!session.args.length) return session.reply(this.help);
        return session.quote(`${session.args}`);
=======
    func: AppCommandFunc<BaseSession> = async (session) => {
        if (!session.args.length) return session.reply(this.help)
        return session.replyOnly(`${session.args}`);
>>>>>>> origin/main
    };
}

export const echoKmd = new EchoKmd();
