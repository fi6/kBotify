import { kBotifyLogger } from '../logger';

export interface CardObject {
    type: 'card';
    size: 'lg' | 'sm';
    theme?: Theme;
    color?: string;
    modules: any[];
}

export type Theme =
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'secondary';

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

export class Card implements CardObject {
    type: 'card' = 'card';
    size: 'lg' | 'sm' = 'lg';
    theme?: Theme;
    color?: string;
    modules: ModuleObject[] = [];
    constructor(content?: string | CardObject) {
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

    setSize(size: CardObject['size']): this {
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

    addTitle(title: string, emoji?: boolean): this {
        this.modules.push({
            type: 'header',
            text: {
                type: 'plain-text',
                content: title,
                emoji,
            },
        });

        return this;
    }

    addImage(
        source: string,
        options?: {
            alt?: string;
            size?: CardObject['size'];
            circle?: boolean;
        }
    ): this {
        this.modules.push({
            type: 'image-group',
            elements: [{ type: 'image', src: source, ...options }],
        });

        return this;
    }

    addText(
        content: string,
        emoji = true,
        accessoryMode: 'right' | 'left' = 'right',
        accessory: any = {}
    ): this {
        if (accessory?.type == 'button' && accessoryMode == 'left') {
            throw new Error('button + mode: left is not valid');
        }

        this.modules.push({
            type: 'section',
            text: {
                type: 'kmarkdown',
                content,
            },
            emoji,
            mode: accessoryMode,
            accessory,
        });

        return this;
    }

    addCountdown(
        mode: 'second' | 'hour' | 'day',
        endTime: number | Date,
        startTime?: number | Date
    ): this {
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
        this.modules.push({
            type: 'countdown',
            mode,
            startTime,
            endTime,
        });

        return this;
    }

    addDivider(): this {
        this.modules.push({ type: 'divider' });

        return this;
    }

    addModule(module: ModuleObject): this {
        this.modules.push(module);

        return this;
    }

    /**
     * Export card object to string. You can use this if you need stringified card with array bracket(usually used when sending single card).
     *
     * @param {boolean} [arrayBracket=true]
     * @return {*}  {string}
     * @memberof Card
     */
    toString(arrayBracket = true): string {
        const object = arrayBracket
            ? [
                  {
                      type: 'card',
                      theme: this.theme,
                      size: this.size,
                      modules: this.modules,
                  },
              ]
            : {
                  type: 'card',
                  theme: this.theme,
                  size: this.size,
                  modules: this.modules,
              };

        return JSON.stringify(object);
    }

    /**
     *
     * @deprecated
     */
    stringify(): string {
        return this.toString();
    }
}
