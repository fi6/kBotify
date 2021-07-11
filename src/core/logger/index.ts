import { default as bunyan } from 'bunyan';

export const kBotifyLogger = bunyan.createLogger({
    name: 'kBotify',
    src: true,
    streams: [{ level: bunyan.WARN, stream: process.stderr }]
});
