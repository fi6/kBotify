import { BaseUser } from '../../../core/user';
import { BaseApi } from './base';

export abstract class UserApi extends BaseApi {
    abstract view(id: string, guildId?: string): BaseUser;
}
