import { Role } from '../../../core/role';
import { BaseApi } from './base';

export abstract class RoleApi extends BaseApi {
    abstract create(
        guildId: string,
        name: string,
        config?: unknown
    ): Promise<Role>;

    abstract view(guildId: string, roleId: string): Promise<Role>;
    abstract update(
        guildId: string,
        roleId: string,
        config: unknown
    ): Promise<Role>;

    abstract delete(guildId: string, roleId: string): Promise<void>;
    abstract grant(
        guildId: string,
        roleId: string,
        config?: unknown
    ): Promise<unknown>;

    abstract revoke(
        guildId: string,
        roleId: string,
        config?: unknown
    ): Promise<unknown>;
}
