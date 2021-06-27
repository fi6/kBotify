import { AppCommand, AppFunc, BaseSession } from '../..';
import { Card } from '../../core/card';

let msgId: string | undefined = '';

class TestUpdate extends AppCommand {
    trigger = 'update';
    help = '';
    intro = '发送一个更新消息';
    func: AppFunc<BaseSession> = async (session) => {
        // console.debug(JSON.stringify([getCard()]));
        if (!session.args.length) {
            session.updateMessage(msgId!, getCard(true).toString(true));
            return;
        }
        // console.log(session);
        // if (session instanceof GuildSession) {
        //     console.log(await session.user.full());
        // }
        msgId = (await session.sendCard(getCard())).msgSent?.msgId;
        return;
    };
}

export const testUpdate = new TestUpdate();

function getCard(update = false) {
    return new Card({
        type: 'card',
        theme: 'secondary',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: update
                        ? 'updated'
                        : '开黑啦：一款出色的文字、语音与组队工具',
                },
            },
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
