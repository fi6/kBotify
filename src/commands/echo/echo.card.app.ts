<<<<<<< HEAD
import { AppCommand, AppFunc, BaseSession } from '../..';

class EchoCard extends AppCommand {
=======
import { BaseSession } from 'commands/core/session';
import { MessageType } from 'kaiheila-bot-root/dist/types';
import { AppCommand } from '../core/app.command';
import { AppCommandFunc, BaseData } from '../core/app.types';
import { ResultTypes } from '../core/types';

class EchoCard extends AppCommand<BaseSession> {
>>>>>>> origin/main
    code = 'card';
    trigger = 'card';
    help = '`.echo card 内容`';
    intro = '复读你所说的文字, 并用CardMessage格式返回。';
<<<<<<< HEAD
    func: AppFunc<BaseSession> = async (session) => {
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
                theme: 'success',
                size: 'lg',
                modules: [
                    {
                        type: 'header',
                        text: {
                            type: 'plain-text',
                            content: '房间创建成功',
                        },
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'kmarkdown',
                            content:
                                '房间创建成功！你的房间信息如下。   \n你可以点击`广播`以将房间广播给所有人。',
                        },
                    },
                    {
                        type: 'action-group',
                        elements: [
                            {
                                type: 'button',
                                theme: 'primary',
                                value: '.echo next',
                                click: 'return-val',
                                text: {
                                    type: 'plain-text',
                                    content: '.echo next',
                                },
                            },
                            {
                                type: 'button',
                                theme: 'danger',
                                value: 'cancel',
                                click: 'return-val',
                                text: {
                                    type: 'plain-text',
                                    content: '取消',
                                },
                            },
                        ],
                    },
                ],
            },
        ];
=======
    func: AppCommandFunc<BaseSession> = async (session) => {
        const msg: string = ''.concat(...session.args).replace('\\n', '')
        // console.log(msg)
        return this.msgSender.send(
            msg,
            session,
            ResultTypes.SUCCESS,
            { reply: true, msgType: 10 }
        );
>>>>>>> origin/main
    };
}

export const echoCard = new EchoCard();
