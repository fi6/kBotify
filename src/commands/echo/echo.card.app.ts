import { AppCommand, AppFunc, BaseSession } from '../..';
import { Card } from '../../core/card';

class EchoCard extends AppCommand {
    code = 'card';
    trigger = 'card';
    help = '`.echo card 内容`';
    intro = '复读你所说的文字, 并用CardMessage格式返回。';
    func: AppFunc = async (session) => {
        const msg: string = ''.concat(...session.args).replace('\\n', '');

        // console.log(msg)
        return session.sendCardTemp(msg.concat);
        // 如果你想发送自定义卡片（非复读），可以参考下边两个方法
        // return session.sendCardTemp(this.card_test1());
        // 你也可以使用下边的方法
        // return session.sendCardTemp(this.card_test2());
    };

    private readonly card_test1 = () => {
        // 这样获得的卡片Object可以进行操作，如card.addHeader等
        return new Card({
            type: 'card',
            theme: 'success',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '房间创建成功'
                    }
                },
                {
                    type: 'section',
                    text: {
                        type: 'kmarkdown',
                        content:
                            '房间创建成功！你的房间信息如下。   \n你可以点击`广播`以将房间广播给所有人。'
                    }
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
                                content: '.echo next'
                            }
                        }
                    ]
                }
            ]
        });
    };

    private readonly card_test2 = () => {
        // 直接从卡片编辑器进行复制即可
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
                            content: '房间创建成功'
                        }
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'kmarkdown',
                            content:
                                '房间创建成功！你的房间信息如下。   \n你可以点击`广播`以将房间广播给所有人。'
                        }
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
                                    content: '.echo next'
                                }
                            }
                        ]
                    }
                ]
            }
        ];
    };
}

export const echoCard = new EchoCard();
