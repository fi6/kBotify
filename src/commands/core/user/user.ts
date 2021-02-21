import { KBotify } from '../../../utils/kbotify';

export class User {
    id: string = '';
    username: string = '';
    identifyNum: string;
    bot: KBotify;
    constructor(userObject: any, bot: KBotify) {
        this.id = userObject.id;
        this.username = userObject.username ?? userObject.nickname;
        this.identifyNum = userObject.identify_num;
        this.bot = bot;
    }
}
