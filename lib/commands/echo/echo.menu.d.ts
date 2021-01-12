import { MenuCommand } from 'commands/shared/command.menu';
import { BaseData } from 'commands/shared/command.types';
declare class Echo extends MenuCommand<BaseData> {
    code: string;
    aliases: string[];
    help: string;
    intro: string;
}
export declare const echo: Echo;
export {};
