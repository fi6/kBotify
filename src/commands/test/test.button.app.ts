import { AppCommand, AppFunc, BaseSession } from '../..';
import { Card } from '../../core/card';
import { GuildSession } from '../../core/session';

class TestButton extends AppCommand {
    code = 'button';
    trigger = 'button';
    help = '`.test button`';
    intro = '发送一个按钮以进行按钮测试';
    func: AppFunc<BaseSession> = async (session) => {
        console.debug(JSON.stringify([getCard()]));
        if (!session.args.length) return session.replyCard(getCard());
        console.log(session);
        if (session instanceof GuildSession) {
            console.log(await session.user.full());
        }
    };
}

export const testButton = new TestButton();

function getCard() {
    return new Card({
        type: 'card',
        theme: 'secondary',
        size: 'lg',
        modules: [
            {
                type: 'action-group',
                elements: [
                    {
                        type: 'button',
                        theme: 'primary',
                        value: '.test button button1',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '按钮1',
                        },
                    },
                ],
            },
        ],
    });
}
