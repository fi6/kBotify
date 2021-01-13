import { AppCommand } from 'commands/shared/app';
import { AppCommandFunc } from 'commands/shared/app.types';
import { BaseData } from 'commands/shared/types';

class EchoKmd extends AppCommand<BaseData> {
    code = 'kmd';
    trigger = 'kmd';
    help = '`.echo kmd 内容`';
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppCommandFunc<BaseData> = async (data) => {
        return this.msgSender.reply(`${data.args}`, data);
    };
}

// export const echoKmd = new EchoKmd();
