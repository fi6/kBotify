import { ChannelApi } from './channel';
import { GuildApi } from './guild';
import { InviteApi } from './invite';
import { MessageApi } from './message';
import { RoleApi } from './role';

export interface Api {
    channel: ChannelApi;
    role: RoleApi;
    guild: GuildApi;
    message: MessageApi;
    invite: InviteApi;
}
