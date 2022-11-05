// noinspection JSUnusedGlobalSymbols

import {kBotifyLogger} from '../logger';

export function kmarkdownEscape(strIn: unknown): string {
    return Object(strIn).toString().replace(/[*~[\]\->():`\\]/g, '\\$&');
}

export type Theme =
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'secondary';
export type Accessory = Button<ButtonEvent> | Image;
export type AccessoryMode<A extends Accessory> = A extends Button<ButtonEvent> ? 'right' : 'left' | 'right';
export type ButtonEvent = 'link' | 'return-val' | '';
export type ButtonVal<E extends ButtonEvent> = E extends 'link' ? URLString : string;
export type FileType = 'file' | 'audio' | 'video';
export type Cover<T extends FileType> = T extends 'audio' ? URLString : undefined;

export type URLString = `${'http' | 'https'}://${string}`;
export type NoneEmptyList<T> = { 0: T } & Array<T>;
export type Array1to4<T> = [T] | [T, T] | [T, T, T] | [T, T, T, T];
export type Array1to5<T> = Array1to4<T> | [T, T, T, T, T];
export type Array1to9<T> =
    | Array1to5<T>
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
    type: string;
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

export class Card implements Typed, CardObject {
    readonly type = 'card';
    readonly modules: CardModule[] = [];

    constructor(content?: string | CardObject | Card,
                public size: 'lg' | 'sm' = 'lg',
                public color?: string,
                public theme?: Theme) {
        if (content) {
            let card: CardObject;
            if (typeof content === 'string') {
                card = JSON.parse(content);
            } else {
                card = content;
            }
            if (!Card.validate(card)) {
                throw new Error(`card is not valid: ${content}`);
            }
            this.theme = card.theme ?? 'primary';
            this.size = card.size;
            this.color = card.color;
            this.modules = [...card.modules];
        }
    }

    static validate(content: CardObject): boolean {
        for (const module of content.modules) {
            if (Array.isArray(module)) {
                return false;
            } // TODO
        }

        return true;
    }

    setSize(size: 'lg' | 'sm'): this {
        this.size = size;

        return this;
    }

    setTheme(theme: Theme): this {
        this.theme = theme;

        return this;
    }

    setColor(color: string): this {
        this.color = color;

        return this;
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

    addModule(module: ModuleObject): this {
        return this.add(module as CardModule);
    }

    /**
     * @deprecated use {@link addHeader} instead
     */
    addTitle(title: string, emoji?: boolean): this {
        return this.add(new Header(new PlainTextObject(title, emoji)));
    }

    addCountdown(mode: 'second' | 'hour' | 'day',
                 endTime: number | Date,
                 startTime?: number | Date): this {
        startTime = startTime
            ? typeof startTime == 'number'
                ? startTime
                : startTime.valueOf()
            : new Date().valueOf();
        endTime = typeof endTime == 'number' ? endTime : endTime.valueOf();
        if (endTime < new Date().valueOf()) {
            kBotifyLogger.warn(
                'endTime < current Time, may cause problem for card'
            );
        }

        return this.add(new Countdown(endTime, startTime, mode))
    }

    /**
     * @deprecated use {@link addImageGroup} instead
     */
    addImage(source: string,
             options?: {
                 alt?: string;
                 size?: 'lg' | 'sm';
                 circle?: boolean;
             }): this {
        return this.addImageGroup(new Image(source as URLString, options?.alt, options?.size, options?.circle));
    }

    /**
     * @deprecated use {@link addKMarkdown} instead
     */
    addText(content: string,
            emoji = true,
            accessoryMode: 'right' | 'left' = 'right',
            accessory: any = {}): this {
        if (accessory?.type == 'button' && accessoryMode == 'left') {
            throw new Error('button + mode: left is not valid');
        }
        return this.addKMarkdown(content, accessory, accessoryMode);
    }

    /**
     * @deprecated ignore this if {@link arrayBracket } is {@code false};
     * otherwise, use {@link CardMessage#toString} instead
     */
    toString(arrayBracket = true): string {
        return JSON.stringify(arrayBracket ? [this] : this);
    }

    toJSON(): this {
        if (this.modules.length > 50) kBotifyLogger.warn('module number exceeds 50, may cause problem for card');
        return this;
    }

    /**
     * @deprecated
     */
    stringify(): string {
        return this.toString();
    }
}

export class CardMessage {
    constructor(public readonly cards: Array1to5<Card>) {
    }

    toString(): string {
        return JSON.stringify(this.cards);
    }

    toJSON(): Card[] {
        if (50 < this.cards.map(card => card.modules.length).reduce((p, c, _i, _a) => p + c)) {
            kBotifyLogger.warn('module number exceeds 50, may cause problem for card');
        }
        return this.cards;
    }
}

/**
 * @deprecated use classes which implements {@link Typed}
 */
export interface ModuleObject {
    [key: string]: any;

    type:
        | 'section'
        | 'image-group'
        | 'header'
        | 'divider'
        | 'action-group'
        | 'context'
        | 'file'
        | 'audio'
        | 'video'
        | 'countdown'
        | 'invite';
}

/**
 * @deprecated use {@link Card}
 */
export interface CardObject {
    type: 'card';
    size: 'lg' | 'sm';
    theme?: Theme;
    color?: string;
    modules: any[];
}
