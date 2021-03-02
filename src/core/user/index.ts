import { User as UserInterface } from 'kaiheila-bot-root';
import { KBotify } from '../kbotify';

export class User implements UserInterface {
    id: string = '';
    username: string = '';
    identifyNum: string;
    online: boolean;
    avatar: string;
    bot: boolean;

    private botInstance: KBotify;

    constructor(userObject: UserInterface, bot: KBotify) {
        this.id = userObject.id;
        this.username = userObject.username;
        this.identifyNum = userObject.identifyNum;
        this.botInstance = bot;
        this.online = userObject.online;
        this.avatar = userObject.avatar;
        this.bot = userObject.bot;
    }
    getBotInstance = () => {
        return this.botInstance;
    };
}
