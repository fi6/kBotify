import { AppCommand } from 'commands/shared/command.app';
import { AppCommandFunc } from 'commands/shared/command.app.types';
import { BaseData } from 'commands/shared/command.types';
declare class EchoKmd extends AppCommand<BaseData> {
    code: string;
    aliases: string[];
    help: string;
    intro: string;
    func: AppCommandFunc<BaseData>;
}
export declare const echoKmd: EchoKmd;
export {};
