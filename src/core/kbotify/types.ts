import {
    ImageMessage,
    VideoMessage,
    FileMessage,
    AudioMessage,
    KMarkdownMessage,
    ButtonClickEvent,
} from 'kaiheila-bot-root';
import { ButtonEventMessage, TextMessage } from '../message';

export interface MessageEmissions {
    text: (event: TextMessage) => void;
    image: (event: ImageMessage) => void;
    video: (event: VideoMessage) => void;
    file: (event: FileMessage) => void;
    audio: (event: AudioMessage) => void;
    buttonEvent: (event: ButtonEventMessage) => void;
}

export interface RawEmissions {
    allMessages: (event: unknown) => void;
    systemMessage: (event: unknown) => void;
    textMessage: (event: TextMessage) => void;
    imageMessage: (event: ImageMessage) => void;
    videoMessage: (event: VideoMessage) => void;
    fileMessage: (event: FileMessage) => void;
    audioMessage: (event: AudioMessage) => void;
    kmarkdownMessage: (event: KMarkdownMessage) => void;
    buttonClick: (event: ButtonClickEvent) => void;
    unknownEvent: (event: unknown) => void;
}
