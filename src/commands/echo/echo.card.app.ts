import { BaseSession } from 'commands/core/session';
import { MessageType } from 'kaiheila-bot-root/dist/types';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc, BaseData } from '../core/app.types';
import { ResultTypes } from '../core/types';

class EchoCard extends AppCommand {
    code = 'card';
    trigger = 'card';
    help = '`.echo card 内容`';
    intro = '复读你所说的文字, 并用CardMessage格式返回。';
    func: AppCommandFunc<BaseSession> = async (session) => {
        const msg: string = ''.concat(...session.args).replace('\\n', '');
        // console.log(msg)
        return session.sendCardTemp(JSON.stringify(this.card_test()));
        // return this.msgSender.send(
        //     msg,
        //     session,
        //     ResultTypes.SUCCESS,
        //     { reply: true, msgType: 10 }
        // );
    };
    private card_test = () => {
        return [
            {
                type: 'card',
                theme: 'secondary',
                size: 'lg',
                modules: [
                    {
                        type: 'countdown',
                        mode: 'hour',
                        endTime: 1613968761797,
                    },
                ],
            },
        ];
    };
}

export const echoCard = new EchoCard();
