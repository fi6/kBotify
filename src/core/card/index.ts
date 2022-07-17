// noinspection JSUnusedGlobalSymbols

import {kBotifyLogger, Theme} from 'kbotify';

export function kmarkdownEscape(strIn: unknown): string {
    return Object(strIn).toString().replace(/[*~[\]\->():`\\]/g, '\\$&');
}

export type Accessory = Button<ButtonEvent> | Image;
export type AccessoryMode<A extends Accessory> = A extends Button<ButtonEvent> ? 'right' : 'left' | 'right';
export type ButtonEvent = 'link' | 'return-val' | '';
export type ButtonVal<E extends ButtonEvent> = E extends 'link' ? URLString : string;
export type FileType = 'file' | 'audio' | 'video';
export type Cover<T extends FileType> = T extends 'audio' ? URLString : undefined;

export type URLString = `${'http' | 'https'}://${string}`
export type NoneEmptyList<T> = { 0: T } & Array<T>;
export type Array1to4<T> = [T] | [T, T] | [T, T, T] | [T, T, T, T];
export type Array1to5<T> = Array1to4<T> | [T, T, T, T, T];
export type Array1to9<T> =
    Array1to5<T>
    | [T, T, T, T, T, T]
    | [T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T]
    | [T, T, T, T, T, T, T, T, T];
export type Array1to10<T> = Array1to9<T> | [T, T, T, T, T, T, T, T, T, T];

export type CardModule =
    | Header
    | Section<Accessory>
    | ImageContainer
    | ImageGroup
    | ActionGroup
    | Context
    | Divider
    | File<FileType>
    | Countdown
    | Invite;

export interface Typed {
    type: string
}

export class KMarkdown implements Typed {
    readonly type = 'kmarkdown';

    constructor(public readonly content: string) {
    }

    toJSON(): this {
        if (this.content.length > 5000) kBotifyLogger.warn('kmarkdown length exceeds 5000, may cause problem for card');
        return this;
    }
}

type PlainText = PlainTextObject | string;

export class PlainTextObject implements Typed {
    readonly type = 'plain-text';

    constructor(public readonly content: string,
                public readonly emoji?: boolean) {
    }

    toJSON(): string | PlainTextObject {
        if (this.content.length > 2000) kBotifyLogger.warn('plain-text length exceeds 2000, may cause problem for card');
        return this.emoji !== true ? this.content : this;
    }
}

export class Image implements Typed {
    readonly type = 'image';

    constructor(public readonly src: URLString,
                public readonly alt?: string,
                public readonly size?: 'sm' | 'lg',
                public readonly circle?: boolean) {
    }
}

export class Button<E extends ButtonEvent> implements Typed {
    readonly type = 'button';

    constructor(public readonly text: string,
                public readonly click?: E,
                public readonly value?: ButtonVal<E>,
                public readonly theme?: Theme) {
    }
}

export class Paragraph implements Typed {
    readonly type = 'paragraph';

    constructor(public readonly fields: ReadonlyArray<KMarkdown | PlainText>,
                public readonly cols?: 1 | 2 | 3) {
    }

    toJSON(): this {
        if (this.fields.length > 50) kBotifyLogger.warn('paragraph length exceeds 50, may cause problem for card');
        return this;
    }
}

export class Section<T extends Accessory> implements Typed {
    readonly type = 'section';

    constructor(public readonly text: Paragraph | KMarkdown | PlainText,
                public readonly accessory?: T,
                public readonly mode?: AccessoryMode<T>) {
    }
}

export class Header implements Typed {
    readonly type = 'header';

    constructor(public readonly text: PlainText) {
    }
}

export class ImageGroup implements Typed {
    readonly type = 'image-group';
    readonly elements: ReadonlyArray<Image>;

    constructor(elements: Array1to9<Image>) {
        this.elements = elements;
    }
}

export class ImageContainer implements Typed {
    readonly type = 'container';
    readonly elements: ReadonlyArray<Image>;

    constructor(elements: Array1to9<Image>) {
        this.elements = elements;
    }
}

export class ActionGroup implements Typed {
    readonly type = 'action-group';
    readonly buttons: ReadonlyArray<Button<ButtonEvent>>;

    constructor(buttons: Array1to4<Button<ButtonEvent>>) {
        this.buttons = buttons;
    }
}

export class Context implements Typed {
    readonly type = 'context';
    readonly elements: ReadonlyArray<PlainText | KMarkdown | Image>;

    constructor(elements: Array1to10<PlainText | KMarkdown | Image>) {
        this.elements = elements;
    }
}

export class Divider implements Typed {
    readonly type = 'divider';
}

export class File<T extends FileType> implements Typed {
    constructor(public readonly type: FileType,
                public readonly src: URLString,
                public readonly title?: string,
                public readonly cover?: Cover<T>) {
    }
}

export class Countdown implements Typed {
    readonly type = 'countdown';

    constructor(public readonly endTime: number,
                public readonly startTime: number,
                public readonly mode: 'day' | 'hour' | 'second') {
    }
}

export class Invite implements Typed {
    readonly type = 'invite';

    constructor(public readonly code: string) {
    }
}

export class Card implements Typed {
    readonly type = 'card';
    readonly modules: CardModule[] = [];

    constructor(public readonly size?: 'lg' | 'sm',
                public readonly color?: string,
                public readonly theme?: Theme) {
    }

    add(module: CardModule): this {
        this.modules.push(module);
        return this;
    }

    addHeader(text: PlainText): this {
        return this.add(new Header(text));
    }

    addSection<T extends Accessory>(text: Paragraph | KMarkdown | PlainText, accessory?: T, accessoryMode?: AccessoryMode<T>): this {
        return this.add(new Section(text, accessory, accessoryMode));
    }

    addPlainText<T extends Accessory>(content: string, emoji?: boolean, accessory?: T, accessoryMode?: AccessoryMode<T>): this {
        return this.addSection(new PlainTextObject(content, emoji), accessory, accessoryMode);
    }

    addKMarkdown<T extends Accessory>(content: string, accessory?: T, accessoryMode?: AccessoryMode<T>): this {
        return this.addSection(new KMarkdown(content), accessory, accessoryMode);
    }

    addParagraph<T extends Accessory>(fields: ReadonlyArray<PlainTextObject | KMarkdown>, cols?: 1 | 2 | 3, accessory?: T, accessoryMode?: AccessoryMode<T>): this {
        return this.addSection(new Paragraph(fields, cols), accessory, accessoryMode);
    }

    addImageGroup(...elements: Array1to9<Image>): this {
        return this.add(new ImageGroup(elements));
    }

    addImageContainer(...elements: Array1to9<Image>): this {
        return this.add(new ImageContainer(elements));
    }

    addActionGroup(...buttons: Array1to4<Button<ButtonEvent>>): this {
        return this.add(new ActionGroup(buttons));
    }

    addContext(...elements: Array1to10<PlainText | KMarkdown | Image>): this {
        return this.add(new Context(elements));
    }

    addDivider(): this {
        return this.add(new Divider());
    }

    addFile<T extends FileType>(type: T, src: URLString, title?: string, cover?: Cover<T>): this {
        return this.add(new File(type, src, title, cover));
    }

    addInvite(code: string): this {
        return this.add(new Invite(code));
    }

    toString(): string {
        return JSON.stringify(this);
    }

    toJSON(): this {
        if (this.modules.length > 50) kBotifyLogger.warn('module number exceeds 50, may cause problem for card');
        return this;
    }
}

export class CardMessage {
    constructor(public readonly cards: Array1to5<Card>) {
    }

    toString(): string {
        return this.cards.toString();
    }

    toJSON(): Card[] {
        if (50 < this.cards.map(card => card.modules.length).reduce((p, c, _i, _a) => p + c)) {
            kBotifyLogger.warn('module number exceeds 50, may cause problem for card');
        }
        return this.cards;
    }
}
