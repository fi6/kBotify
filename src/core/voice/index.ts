import { khlVoice } from 'khl-voice';

export function createVoice(
    token: string,
    channel: string,
    input: string,
    repeat = true
) {
    let voice = new khlVoice(token, repeat);
    voice = voice.set_channel(channel);
    const child = voice.play(input);

    return child;
}
