import { AppCommand, MenuCommand, BaseSession } from '../..';
import { ButtonClickEvent, KaiheilaBot } from 'kaiheila-bot-root';
import { CurrentUserInfoInternal } from 'kaiheila-bot-root/dist/api/user/user.types';
import { BotConfig } from 'kaiheila-bot-root/dist/BotInstance';
import { TextMessage } from '../message';
import { Emissions } from './ee.interface';

export declare interface KBotify {
    on<K extends keyof Emissions>(event: K, listener: Emissions[K]): this;

    emit<K extends keyof Emissions>(
        event: K,
        ...args: Parameters<Emissions[K]>
    ): boolean;
}

export class KBotify extends KaiheilaBot {
    commandMap = new Map<string, AppCommand | MenuCommand>();
    help = 'help for this bot.';
    botId: string | number = 'kaiheila user id for this bot.';

    /**
     * Creates an instance of KBotify.
     * @param config the config of bot, please see readme.md
     * @param [default_process=true] turn off if you want to process every incoming message yourself.
     * @memberof KBotify
     */
    constructor(config: BotConfig, default_process = true) {
        super(config);
        if (default_process) {
            this.on('textMessage', (rawMessage) => {
                const msg = new TextMessage(rawMessage, this);
                const res = this.processMsg(msg);
                if (!res) return;
                const [command, ...args] = res;
                this.execute(command.toLowerCase(), args, msg);
            });
            this.on('buttonClick', (msg) => {
                if (!msg.value.startsWith('.')) return;
                const [command, ...rest] = msg.value
                    .slice(1)
                    .trim()
                    .split(/ +/);
                this.execute(command, rest, msg);
            });
        }
    }

    connect() {
        this.messageSource.connect().then((res) => {
            console.info('connected:', res);
        });
        this.API.user.me().then((info: CurrentUserInfoInternal) => {
            this.botId = info.id;
            console.info('bot id: ', this.botId);
        });
    }
    /**
     * Process the msg object and generate [command, ...args]
     *
     * @param msg
     * @return string
     * @memberof KBotify
     */
    processMsg(msg: TextMessage): string[] | void {
        if (msg.content.startsWith('.') || msg.content.startsWith('。')) {
            // console.log(msg)
            return msg.content.slice(1).trim().split(/ +/);
        }
        if (msg.mention.user[0] == this.botId && msg.content.startsWith('@')) {
            const [, command, ...rest] = msg.content.trim().split(/ +/);
            return [command ? command.toLowerCase() : '', ...rest];
        }
    }

    /**
     * Add menu/app to this bot.
     *
     * @param commands array of instances of menu/app command
     * @memberof KBotify
     */
    addCommands = (...commands: (MenuCommand | AppCommand)[]): void => {
        for (const command of commands) {
            command.init(this);
            if (command instanceof MenuCommand) {
                for (const app of command.appMap.values()) {
                    app.init(this);
                }
            }
            this.commandMap.set(command.trigger, command);
        }
    };

    /**
     * Add alias for certain menu/app
     *
     * @param command instance of menu/app command
     * @param alias
     * @memberof KBotify
     */
    addAlias = (
        command: MenuCommand | AppCommand,
        ...aliases: string[]
    ): void => {
        command.init(this);
        if (command instanceof MenuCommand) {
            for (const app of command.appMap.values()) {
                app.init(this);
            }
        }
        aliases.forEach((alias) => {
            this.commandMap.set(alias, command);
        });
    };
    /**
     * Process the command.
     *
     * @param command
     * @param args
     * @param msg
     * @memberof KBotify
     */
    execute = async (
        command: string,
        args: string[],
        msg: TextMessage | ButtonClickEvent
    ): Promise<unknown> => {
        // const data: [string, string[], TextMessage] = [command, args, msg];
        const regex = /^[\u4e00-\u9fa5]/;
        const cmd = this.commandMap.get(command);

        if (cmd) return cmd.exec(new BaseSession(cmd, args, msg, this));

        if (regex.test(command)) {
        }
        return;
    };
}
