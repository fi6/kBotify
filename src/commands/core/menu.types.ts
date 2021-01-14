import { AppCommand } from './app.command';

/**
 * Params for initializing MenuCommand class.
 *
 * @export
 * @interface MenuCommandParams
 * @template T extends BaseData
 * @param code string
 * @param trigger string
 * @param help string
 * @param apps AppCommand<T>[]
 */
export interface MenuCommandParams {
    code: string;
    trigger: string;
    help: string;
    apps: AppCommand<any>[];
}

export {};
