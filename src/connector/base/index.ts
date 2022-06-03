import { AppCommand, MenuCommand } from '../../core/command';
import { Api } from './api';
import { EventProcessor } from './ee';

export abstract class BaseConnector {
    commandMap = new Map<string, AppCommand | MenuCommand>();
    name = 'default';
    abstract event: EventProcessor;
    abstract api: Api;
}
