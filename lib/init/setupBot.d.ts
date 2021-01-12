import { AppCommand } from 'commands/shared/command.app';
import { MenuCommand } from 'commands/shared/command.menu';
import { BotConfig, KaiheilaBot } from 'kaiheila-bot-root';
import { TextMessage } from 'kaiheila-bot-root/dist/types';
export declare class KBot extends KaiheilaBot {
    commandMap: Map<any, any>;
    help: string;
    botId: string;
    constructor(config: BotConfig);
    private processMsg;
    addCommand: (command: AppCommand<any> | MenuCommand<any>) => void;
    execute: (command: string, args: string[], msg: TextMessage) => Promise<void | import("../commands/shared/command.types").ResultTypes>;
}
