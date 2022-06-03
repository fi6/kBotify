/* eslint-disable no-console */
import { AppCommand, AppFunc } from '../..';
import { Card } from '../../core/card';

class TestButton extends AppCommand {
    code = 'button';
    trigger = 'button';
    help = '`.test button`';
    intro = '发送一个按钮以进行按钮测试';
    func: AppFunc = async (session) => {
        // console.debug(JSON.stringify([getCard()]));
        // if (!session.args.length) return session.replyCard(getCard());
        // console.log(session);
        const userlist = await session.client.Api.guild.userList(
            session.guildId as any
        );
        // console.log(userlist);
        // if (session instanceof GuildSession) {
        //     console.log(await session.user.full());
        // }
        // const result = await session.client.API.message.create(
        //     9,
        //     '5915997491396830',
        //     'test'
        // );
        // console.log(result);
        // const object = JSON.parse(
        //     '[{"type":"card","theme":"secondary","size":"lg","modules":[{"type":"header","text":{"type":"plain-text","content":"鑳¤悵鍗滅瀛?T1_FARM_CARROT_SEED"}},{"type":"section","text":{"type":"paragraph","cols":3,"fields":[{"type":"kmarkdown","content":"**Thetford**"},{"type":"kmarkdown","content":"**鍑哄敭浠锋牸**\n 1749-3500"},{"type":"kmarkdown","content":"**涔板叆浠锋牸**\n 1-1593"}]}},{"type":"context","elements":[{"type":"plain-text","content":"Testing"}]}]}]'
        // );
        // console.log(object);
        // console.log(getCard().toString());
        // const result = session.sendCard(JSON.stringify(getCard().toString()));
        const result = await session.send(JSON.stringify(text()));

        return result;
    };
}

export const testButton = new TestButton();

function text() {
    return `
    ---
部落名: فديتك ياعمري
参赛成员：27
---
拥有九本 x4
拥有十本 x9
拥有十一本 x4
拥有十二本 x3
拥有十三本 x4
拥有十四本 x3
---
部落名: LOS VIKINGOS
参赛成员：35
---
拥有五本 x1
拥有六本 x1
拥有七本 x1
拥有八本 x1
拥有九本 x5
拥有十本 x5
拥有十一本 x10
拥有十二本 x4
拥有十三本 x5
拥有十四本 x2
---
部落名: '故~兮~梦'
参赛成员：38
---
拥有七本 x1
拥有八本 x2
拥有九本 x4
拥有十本 x10
拥有十一本 x12
拥有十二本 x5
拥有十三本 x3
拥有十四本 x1
---
部落名: Kamelions
参赛成员：41
---
拥有十一本 x13
拥有十二本 x14
拥有十三本 x10
拥有十四本 x4
---
部落名: Dark Knights
参赛成员：39
---
拥有四本 x1
拥有八本 x1
拥有九本 x3
拥有十本 x4
拥有十一本 x12
拥有十二本 x8
拥有十三本 x5
拥有十四本 x5
---
部落名: Cik Ott...
参赛成员：46
---
拥有十一本 x9
拥有十二本 x18
拥有十三本 x11
拥有十四本 x8
---
部落名: LEGENDS IR
参赛成员：15
---
拥有五本 x1
拥有七本 x2
拥有八本 x2
拥有九本 x1
拥有十本 x4
拥有十一本 x3
拥有十三本 x1
拥有十四本 x1
---
部落名: Balkan
参赛成员：29
---
拥有六本 x1
拥有七本 x2
拥有九本 x5
拥有十本 x7
拥有十一本 x6
拥有十二本 x6
拥有十三本 x2
---
    `;
}

function testCard() {
    return JSON.stringify([
        {
            type: 'card',
            theme: 'secondary',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: '鑳¤悵鍗滅瀛?T1_FARM_CARROT_SEED',
                    },
                },
                {
                    type: 'section',
                    text: {
                        type: 'paragraph',
                        cols: 3,
                        fields: [
                            {
                                type: 'kmarkdown',
                                content: '**Thetford**',
                            },
                            {
                                type: 'kmarkdown',
                                content: '**鍑哄敭浠锋牸**\n 1749-3500',
                            },
                            {
                                type: 'kmarkdown',
                                content: '**涔板叆浠锋牸**\n 1-1593',
                            },
                        ],
                    },
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'plain-text',
                            content: 'Testing',
                        },
                    ],
                },
            ],
        },
    ]);
}

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
