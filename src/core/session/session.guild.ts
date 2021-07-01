import { AppCommand } from '../command/command.app';
import { Guild } from '../guild';
import { KBotify } from '../kbotify';
import { MenuCommand } from '../command';
import { ButtonEventMessage, TextMessage } from '../message';
import { BaseSession } from './session.base';
import { GuildUser } from '../user/user.guild';
import { log } from '../logger';

export class GuildSession extends BaseSession {
    user: GuildUser;
    guild: Guild;
    constructor(
        command: AppCommand | MenuCommand,
        args: string[],
        msg: TextMessage | ButtonEventMessage,
        client?: KBotify
    ) {
        super(command, args, msg, client);
        if (!msg.guildId) throw new TypeError('getting msg without guildId');

        this.guild = new Guild(msg.guildId, this.client); // TODO
        if (msg instanceof TextMessage) {
            this.userId = msg.authorId;
            this.user = new GuildUser(msg.author, this.guild.id, this.client);
        } else {
            this.userId = msg.userId;
            this.user = new GuildUser(
                msg.user as any,
                this.guild.id,
                this.client
            );
        }
    }
    static fromSession = async (
        session: BaseSession,
        full = false
    ): Promise<GuildSession> => {
        if (full && !(session.msg instanceof TextMessage)) {
            const user = await new GuildUser(
                session.user as any,
                session.guildId!,
                session.client
            ).full();
            session.msg.user = user;
        }
        return new GuildSession(
            session.command,
            session.args,
            session.msg,
            session.client
        );
    };

    /**
     * 等待用户在当前频道发送的下一条消息。
     *
     * @param {RegExp} condition
     * @param {(number | undefined)} [timeout=6e4] timeout time, in **ms**
     * @memberof GuildSession
     */
    awaitMessage = async (
        condition: RegExp,
        timeout: number | undefined = 6e4
    ): Promise<TextMessage | undefined> => {
        if (timeout < 1e3) log.warn(`timeout too short: ${timeout}, ${this}`);
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
