export type CardObject = {
    type: 'card';
    size: 'lg' | 'sm';
    theme?: Theme;
    color?: string;
    modules: any[];
};

export type Theme =
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'secondary';

export type ModuleObject = {
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
        | 'countdown';
};

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
            if (!Card.validate(card))
                throw new Error(`card is not valid: ${content}`);
            this.theme = card.theme ?? 'primary';
            this.size = card.size;
            this.color = card.color;
            this.modules = [...card.modules];
        }
    }

    public static validate(content: CardObject): boolean {
        for (const module of content.modules) {
            if (Array.isArray(module)) return false; // TODO
        }
        return true;
    }

    public setSize(size: CardObject['size']): this {
        this.size = size;
        return this;
    }

    public setTheme(theme: Theme): this {
        this.theme = theme;
        return this;
    }

    public setColor(color: string): this {
        this.color = color;
        return this;
    }

    public addTitle(title: string, emoji?: boolean): this {
        this.modules.push({
            type: 'header',
            text: {
                type: 'plain-text',
                content: title,
                emoji: emoji,
            },
        });
        return this;
    }

    public addImage(
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

    public addText(
        content: string,
        emoji = true,
        accesory: undefined = undefined
    ): this {
        this.modules.push({
            type: 'section',
            text: { type: 'kmarkdown', content, emoji: emoji },
        });
        return this;
    }

    public addDivider(): this {
        this.modules.push({ type: 'divider' });
        return this;
    }

    /**
     * Export card object to string. You can use this if you need stringified card with array bracket(usually used when sending single card).
     *
     * @param {boolean} [arrayBracket=true]
     * @return {*}  {string}
     * @memberof Card
     */
    public toString(arrayBracket = true): string {
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
    public stringify(): string {
        return this.toString();
    }
}
