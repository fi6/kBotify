import { BaseSession } from 'commands/core/session';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc, BaseData } from '../core/app.types';

class EchoKmd extends AppCommand<BaseSession> {
    code = 'kmd';
    trigger = 'kmd';
    help = '`.echo kmd 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppCommandFunc<BaseSession> = async (session) => {
        return this.msgSender.reply(`${session.args}`, session);
    };
}

export const echoKmd = new EchoKmd();
