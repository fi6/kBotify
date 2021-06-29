import { default as bunyan } from 'bunyan';

export const log = bunyan.createLogger({
    name: 'kBotify',
    src: true,
    streams: [{ level: 'warn', stream: process.stderr }],
});
