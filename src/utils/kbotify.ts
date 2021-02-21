import { AppCommand } from '../commands/core/app.command';
import { MenuCommand } from '../commands/core/menu.command';
import { BotConfig, KaiheilaBot } from 'kaiheila-bot-root';
import {
    AudioMessage,
    FileMesage,
    ImageMessage,
    KMarkDownMessage,
    MessageBase,
    TextMessage,
    VideoMessage,
} from 'kaiheila-bot-root/dist/types';
import { BaseSession } from '../commands/core/session';
import { CurrentUserInfo } from 'kaiheila-bot-root/dist/types/api';
import {
    KHMessage,
    KHSystemMessage,
} from 'kaiheila-bot-root/dist/types/kaiheila/kaiheila.type';

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
            this.on('message', (msg) => {
                msg = msg as TextMessage;
                const res = this.processMsg(msg);
                if (!res) return;
                const [command, ...args] = res;
                this.execute(command.toLowerCase(), args, msg);
            });
            this.on('systemMessage', (msg) => {
                if (msg.extra.type !== 'message_btn_click') return;
                if (!msg.extra.body.value.startsWith('.')) return;
                const [command, ...rest] = msg.extra.body.value
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
        this.getCurrentUserInfo().then((info: CurrentUserInfo) => {
            this.botId = info.id;
        });
    }
    /**
     * Process the msg object and generate [command, ...args]
     *
     * @param msg
     * @return string
     * @memberof KBotify
     */
    processMsg(msg: TextMessage | KMarkDownMessage): string[] | void {
        msg = msg as TextMessage;
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
        msg: KHSystemMessage | TextMessage | KMarkDownMessage
    ): Promise<unknown> => {
        // const data: [string, string[], TextMessage] = [command, args, msg];
        const regex = /^[\u4e00-\u9fa5]/;
        const cmd = this.commandMap.get(command);

        if (cmd) return cmd.exec(new BaseSession(cmd, args, msg, this));

        if (regex.test(command)) {
            return this.sendChannelMessage(
                1,
                msg.channelId,
                '不是有效的命令。查看帮助请发送[.帮助]'
            );
        }
        return;
    };

    sendChannelMessage(
        type: number,
        channelId: any,
        content: string,
        quote?: string,
        tempTargetId?: string
    ) {
        return this.post('v3/channel/message', {
            type: type,
            channel_id: channelId,
            content: content,
            quote: quote,
            temp_target_id: tempTargetId,
            nonce: Math.random(),
        });
    }
}
