import { KBotify } from '../kbotify';

export async function getUserFromGuild(
    username: string,
    guildId: string,
    userId: string,
    bot: KBotify,
    maxMatchUsers = 50
) {
    const users = await bot.API.guild.userList(
        guildId,
        undefined,
        username,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        maxMatchUsers
    );
    for (const user of users.items) {
        if (user.id == userId) {return user; }
    }
    throw new Error(
        'Cannot find user by username, userid, guildid, maxMatchUsers'
    );
}
// TODO
