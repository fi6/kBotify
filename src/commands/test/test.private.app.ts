import { AppCommand, AppFunc, BaseSession } from '../..';
import { Card } from '../../core/card';
import { kBotifyLogger } from '../../core/logger';
import { GuildSession } from '../../core/session';

class TestPrivate extends AppCommand {
    code = 'private';
    trigger = 'private';
    help = '`.test private`';
    response: 'both' = 'both';
    intro = '发送一个按钮以进行按钮测试';
    func: AppFunc = async (session) => {
        // console.debug(JSON.stringify([getCard()]));
        // if (!session.args.length) return session.replyCard(getCard());
        kBotifyLogger.info(session);

        // if (session instanceof GuildSession) {
        //     console.log(await session.user.full());
        // }
        return session.send('test');
        // return session.sendCard(getCard());
    };
}

export const testPrivate = new TestPrivate();
