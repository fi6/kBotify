import { AppCommand } from 'commands/shared/app';
import { AppCommandFunc } from 'commands/shared/app.types';
import { BaseData } from 'commands/shared/types';
declare class EchoKmd extends AppCommand<BaseData> {
    code: string;
    aliases: string[];
    help: string;
    intro: string;
    func: AppCommandFunc<BaseData>;
}
export declare const echoKmd: EchoKmd;
export {};
