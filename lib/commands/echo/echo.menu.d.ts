import { MenuCommand } from 'commands/shared/menu';
import { BaseData } from 'commands/shared/types';
declare class Echo extends MenuCommand<BaseData> {
    code: string;
    aliases: string[];
    help: string;
    intro: string;
}
export declare const echo: Echo;
export {};
