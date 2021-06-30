import { AppCommand, AppFunc, BaseSession } from '../..';
import { Card } from '../../core/card';
import { GuildSession } from '../../core/session';

class TestButton extends AppCommand {
    code = 'button';
    trigger = 'button';
    help = '`.test button`';
    intro = '发送一个按钮以进行按钮测试';
    func: AppFunc<BaseSession> = async (session) => {
        // console.debug(JSON.stringify([getCard()]));
        // if (!session.args.length) return session.replyCard(getCard());
        console.log(session);
        // if (session instanceof GuildSession) {
        //     console.log(await session.user.full());
        // }
        return session.sendCard(getCard());
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
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '开黑啦：一款出色的文字、语音与组队工具',
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

function getComplexCard() {
    const card = new Card({
        type: 'card',
        theme: 'secondary',
        size: 'lg',
        modules: [
            {
                type: 'header',
                text: {
                    type: 'plain-text',
                    content: '房间菜单',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'kmarkdown',
                    content: '开黑啦是最好的~~语音~~软件:smile:',
                },
            },
            {
                type: 'action-group',
                elements: [
                    {
                        type: 'button',
                        theme: 'primary',
                        value: '.房间 查看',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '查看房间列表',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'success',
                        value: '.房间 创建',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '创建房间',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'danger',
                        value: '.房间 管理',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '管理房间',
                        },
                    },
                    {
                        type: 'button',
                        theme: 'danger',
                        value: '.欢迎 快捷 斗天梯',
                        click: 'return-val',
                        text: {
                            type: 'plain-text',
                            content: '斗天梯',
                        },
                    },
                ],
            },
        ],
    });
    return card;
}
