import { KBotify } from "../../../utils/kbotify";

export class User {
    id: string = '';
    nickname: string = '';
    identifyNum: string
    bot: KBotify
    constructor(userObject: any, bot: KBotify) {
        this.id = userObject.id;
        this.nickname = userObject.nickname;
        this.identifyNum = userObject.identify_num
        this.bot = bot
    }
}
