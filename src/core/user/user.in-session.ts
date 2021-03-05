import { User, UserInGuild } from 'kaiheila-bot-root';
import { KBotify } from '../kbotify';
import { BaseSession } from '../session';
import { BaseUser } from './user.base';

class SessionUser extends BaseUser {
    #roles?: number[];
    #session: BaseSession;
    constructor(
        session: BaseSession,
        userObject: User | (User & UserInGuild),
        bot: KBotify
    ) {
        super(userObject, bot);
        this.#session = session;
        if ('roles' in userObject) {
            this.#roles = userObject.roles;
        } else {
            this.#roles = undefined;
        }
    }
    get roles() {
        if (typeof this.#roles == 'undefined') {
            return []; // TODO
        }
        if (!Array.isArray(this.#roles))
            throw new Error('roles not type of array');
        return this.#roles;
    }
}
