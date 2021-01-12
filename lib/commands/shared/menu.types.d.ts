import { AppCommand } from './app';
import { BaseData } from './types';
/**
 * Params for initializing MenuCommand class.
 *
 * @export
 * @interface MenuCommandParams
 * @template T extends BaseData
 * @param code string
 * @param aliases string[]
 * @param help string
 * @param apps AppCommand<T>[]
 */
export interface MenuCommandParams<T extends BaseData> {
    code: string;
    aliases: string[];
    help: string;
    apps: AppCommand<T>[];
}
export {};
