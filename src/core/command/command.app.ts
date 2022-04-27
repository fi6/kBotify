import { MessageCreateResponseInternal } from 'kaiheila-bot-root/dist/api/message/message.types';
import { KBotify } from '../..';
import { ButtonEventMessage, TextMessage } from '../message';
import { GuildSession, PrivateSession, BaseSession } from '../session';
import { BaseCommand, ResultTypes, CommandTypes } from '../types';
import { kBotifyLogger } from '../logger';
import { AppFunc, FuncResult } from './types';
import { MenuCommand } from './command.menu';

export function initFuncResult<T>(
    data: T,
    resultType?: ResultTypes,
    msgSent?: MessageCreateResponseInternal
): FuncResult {
    const funcResult: FuncResult<T> = {
        detail: data,
        resultType: resultType ? resultType : ResultTypes.PENDING,
        msgSent,
    };

    return funcResult;
}

/**
 * Class of functional command.
 * you need to initialize code, trigger, help, func for proper usage.
 * Please return ResultTypes.HELP if you need to show the help message. AppCommand.exec will handle this.
 *
 * @export
 * @class AppCommand
 * @param code 功能代号
 * @param trigger 触发功能可用的字符串
 * @param help 功能提示/帮助文字
 * @param intro 功能简介，用于生成菜单
 * @param func 负责执行功能
 * @param [messageSender] 负责发送消息
 * @template T
 */
export abstract class AppCommand implements BaseCommand {
    code = 'code';
    /**
     * 命令响应：仅响应频道，仅响应私聊，全部响应
     */
    response: 'guild' | 'private' | 'both' = 'guild';
    /**
     * 默认的触发命令，如果有上级菜单需要先触发菜单
     */

    /**
     * 帮助文字，发送`.命令 帮助`时自动回复，kmarkdown消息
     */
    help = 'help';
    /**
     * 命令介绍，自动生成菜单时调用
     */
    intro = 'intro';
    client: KBotify | undefined;

    /**
     * 接受的消息类型，默认为Button和Text，如有需要可以更改
     *
     * @memberof AppCommand
     */
    acceptMessageType: (typeof TextMessage | typeof ButtonEventMessage)[] = [
        TextMessage,
        ButtonEventMessage,
    ];

    parent: MenuCommand | null = null;

    readonly type = CommandTypes.APP;

    abstract trigger: string;

    get _botInstance(): KBotify | undefined {
        return this.client;
    }

    constructor() {
        //
    }

    func: AppFunc<BaseSession | GuildSession> = async (_data) => {
        throw new Error(`${this.code}的func尚未定义`);
    };

    init = (bot: KBotify): void => {
        this.client = bot;
    };

    async exec(
        command: string,
        args: string[],
        msg: any
    ): Promise<ResultTypes | void>;

    async exec(
        session: BaseSession | GuildSession | PrivateSession
    ): Promise<ResultTypes | void>;

    async exec(
        sessionOrCommand: BaseSession | string,
        args?: string[],
        msg?: ButtonEventMessage | TextMessage
    ): Promise<ResultTypes | void> {
        if (!this.client) {
            throw new Error('command used before assigning a bot');
        }
        const session = await this.createSession(sessionOrCommand, args, msg);
        if (!this.checkInput(session, msg)) {
            return;
        }
        kBotifyLogger.debug('running command', this.constructor.name);

        return this.run(session);
        /*
        if (sessionOrCommand instanceof BaseSession) {
            // try to change basesession to guildsession if guildid exists
            if (sessionOrCommand.msg.guildId) {
                try {
                    sessionOrCommand = await GuildSession.fromSession(
                        sessionOrCommand,
                        false
                    );
                } catch (error) {
                    log.error(
                        'Error when getting guild session',
                        sessionOrCommand
                    );
                }
            }
            if (
                !(sessionOrCommand instanceof GuildSession) &&
                this.response == 'guild'
            ) {
                log.debug('guild only command receiving base session. return.');

                return;
            }
            sessionOrCommand.command = this;

            return this.run(sessionOrCommand);
        } else {
            if (!args || !msg) {throw new Error(
                    'Missing args or msg when using exec(command, args, msg)'
                );
            return this.run(this.createSession(this, args, msg, this.client));
        }*/
    }

    /**
     * return true if check passed
     *
     * @param {(BaseSession | string)} sessionOrCommand
     * @param {(TextMessage | ButtonEventMessage)} [msg]
     * @memberof AppCommand
     */
    checkInput = async (
        sessionOrCommand: BaseSession | string,
        msg?: TextMessage | ButtonEventMessage
    ): Promise<boolean> => {
        if (
            this.response === 'guild' &&
            !(sessionOrCommand instanceof GuildSession)
        ) {
            kBotifyLogger.debug(
                `guild only command ${this.constructor.name} receiving base session. return.`
            );

            return false;
        }
        if (
            this.response === 'private' &&
            !(sessionOrCommand instanceof PrivateSession)
        ) {
            kBotifyLogger.debug(
                `private only command ${this.constructor.name} receiving private session. return.`
            );

            return false;
        }
        msg = msg ?? (sessionOrCommand as BaseSession).msg;
        for (const messageType of this.acceptMessageType) {
            if (msg instanceof messageType) {
                return true;
            }
        }

        return false;
    };

    createSession = async (
        sessionOrCommand: BaseSession | string,
        args?: string[],
        msg?: TextMessage | ButtonEventMessage,
        client?: KBotify
    ): Promise<BaseSession | GuildSession | PrivateSession> => {
        if (sessionOrCommand instanceof BaseSession) {
            let session: BaseSession | GuildSession | PrivateSession =
                sessionOrCommand;
            // try to change basesession to guildsession if guildid exists
            if (sessionOrCommand.msg.guildId) {
                try {
                    session = await GuildSession.fromSession(
                        sessionOrCommand,
                        false
                    );
                } catch (error) {
                    kBotifyLogger.error(
                        'Error when getting guild session',
                        sessionOrCommand
                    );
                }
            } else if (sessionOrCommand.msg.channelType === 'PERSON') {
                session = await PrivateSession.fromSession(sessionOrCommand);
            }
            session.command = this;

            return session;
        } else {
            if (!args || !msg) {
                throw new Error(
                    'Missing args or msg when using exec(command, args, msg)'
                );
            }
            if (msg.guildId) {
                return new GuildSession(this, args, msg, client);
            } else {
                return new BaseSession(this, args, msg, client);
            }
        }
    };

    private async run(
        session: BaseSession | GuildSession
    ): Promise<ResultTypes> {
        const args = session.args;
        const msg = session.msg;
        kBotifyLogger.debug('running command: ', session.cmdString, args);
        if (!this.client) {
            throw new Error(
                "'Command used before assigning a bot instance or message sender.'"
            );
        }

        try {
            if (args[0] === '帮助') {
                session.reply(this.help);

                return ResultTypes.HELP;
            }

            const result = await this.func(session as any);
            if (typeof result === 'string' || !result) {
                return result ? result : ResultTypes.SUCCESS;
            }

            return result.resultType;
        } catch (error) {
            kBotifyLogger.error(error);

            return ResultTypes.ERROR;
        }
    }
}

export {};
