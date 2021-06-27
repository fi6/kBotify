import { AppCommand } from '../command/command.app';
import { Guild } from '../guild';
import { KBotify } from '../kbotify';
import { MenuCommand } from '../command';
import { ButtonEventMessage, TextMessage } from '../message';
import { BaseSession } from './session.base';
import { GuildUser } from '../user/user.guild';

export class GuildSession extends BaseSession {
    user: GuildUser;
    guild: Guild;
    constructor(
        command: AppCommand | MenuCommand,
        args: string[],
        msg: TextMessage | ButtonEventMessage,
        bot?: KBotify
    ) {
        super(command, args, msg, bot);
        if (!msg.guildId) throw new TypeError('getting msg without guildId');

        this.guild = new Guild(msg.guildId, this.client); // TODO
        if (msg instanceof TextMessage) {
            this.userId = msg.authorId;
            this.user = new GuildUser(
                msg.author,
                this.guild.id,
                this.client
            );
        } else {
            this.userId = msg.userId;
            this.user = new GuildUser(
                msg.user as any,
                this.guild.id,
                this.client
            );
        }
    }
    static fromSession = (session: BaseSession): GuildSession => {
        return new GuildSession(
            session.command,
            session.args,
            session.msg,
            session.client
        );
    };
    awaitMessage = async (
        condition: RegExp,
        timeout: number | undefined = 6e4
    ): Promise<TextMessage | undefined> => {
        if (timeout < 1e3)
            console.warn(`timeout too short: ${timeout}, ${this}`);
        const collector = this.client.collectors.user.create(
            this.userId,
            timeout
        );
        const result = new Promise<TextMessage | undefined>(
            (resolve, reject) => {
                collector.on('add', (message: TextMessage) => {
                    if (condition.test(message.content)) {
                        resolve(message);
                        collector.stop();
                    }
                });
                collector.on('stop', () => {
                    resolve(undefined);
                });
                collector.on('cancel', () => {
                    reject(
                        `new collector for ${this} is set, cancelling current collector`
                    );
                });
            }
        );
        return result;
    };
}
