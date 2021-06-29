import { AppCommand, MenuCommand } from '../..';
import { KaiheilaBot } from 'kaiheila-bot-root';
import { CurrentUserInfoInternal } from 'kaiheila-bot-root/dist/api/user/user.types';

import { ButtonEventMessage, TextMessage } from '../message';
import { BotConfig, RawEmissions } from './types';
import { MessageProcessor } from './message.ee';
import { EventProcessor } from './event.ee';
import { messageParser } from './message.parse';
import { createSession } from '../session';
import { CacheManager } from '../cache/cache.manager';
import { CollectorManager } from './collector';
import { log } from '../logger';
import { LogLevel } from 'bunyan';

export declare interface KBotify {
    on<K extends keyof RawEmissions>(event: K, listener: RawEmissions[K]): this;

    emit<K extends keyof RawEmissions>(
        event: K,
        ...args: Parameters<RawEmissions[K]>
    ): boolean;
}

export class KBotify extends KaiheilaBot {
    commandMap = new Map<string, AppCommand | MenuCommand>();
    help = 'help for this bot.';
    userId: string | number = 'kaiheila user id for this bot.';
    message: MessageProcessor;
    event: EventProcessor;
    mentionWithSpace: boolean;
    cache: CacheManager;
    collectors = new CollectorManager();
    logger = log;
    /**
     * Creates an instance of KBotify.
     * @param config the config of bot, please see readme.md
     * @param [default_process=true] Deprecated. if you want to process message yourself, please change the KBotify.defaultHandler() method.
     * @memberof KBotify
     */
    constructor(
        config: BotConfig & { debug?: boolean },
        defaultProcess = true
    ) {
        super(config);
        if (config.debug === true) {
            this.logger.addStream({
                level: 'debug',
                stream: process.stdout, // log INFO and above to stdout
            });
        }
        this.message = new MessageProcessor(this);
        this.event = new EventProcessor(this);
        this.cache = new CacheManager(this);
        this.mentionWithSpace =
            config.mentionWithSpace === false ? false : true;
    }

    connect() {
        this.on('allMessages', (msg: any) => {
            this.message.process(msg, this);
            this.event.process(msg, this);
        });
        this.defaultHandler();
        this.messageSource.connect().then((res) => {
            log.debug('connected: ', res);
        });
        this.API.user.me().then((info: CurrentUserInfoInternal) => {
            this.userId = info.id;
            log.debug('bot userId:', this.userId);
        });
    }

    defaultHandler() {
        this.message.on('text', (msg) => {
            const res = this.processMsg(msg);
            if (!res) return;
            const [command, ...args] = res;
            this.execute(command.toLowerCase(), args, msg);
        });
        this.message.on('buttonEvent', (msg) => {
            const res = this.processMsg(msg);
            if (!res) return;
            const [command, ...args] = res;
            this.execute(command.toLowerCase(), args, msg);
        });
    }

    /**
     * Process the msg object and generate [command, ...args]
     *
     * @param msg
     * @return [command, ...args] | void
     * @memberof KBotify
     */
    processMsg(msg: TextMessage | ButtonEventMessage): string[] | void {
        return messageParser(msg, this);
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
                for (const app of command.commandMap.values()) {
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
            for (const app of command.commandMap.values()) {
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
        msg: TextMessage | ButtonEventMessage
    ): Promise<unknown> => {
        // const data: [string, string[], TextMessage] = [command, args, msg];
        const regex = /^[\u4e00-\u9fa5]/;
        const cmd = this.commandMap.get(command);
        let session;
        if (cmd) {
            return cmd.exec(createSession(cmd, args, msg, this));
        }

        if (regex.test(command)) {
        }
        return;
    };
}
