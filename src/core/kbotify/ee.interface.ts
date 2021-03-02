import {
    TextMessage,
    ImageMessage,
    VideoMessage,
    FileMessage,
    AudioMessage,
    KMarkdownMessage,
    ButtonClickEvent,
} from 'kaiheila-bot-root';

export interface Emissions {
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

export {};
