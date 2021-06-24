export type CardObject = {
    type: 'card';
    size: 'lg' | 'sm';
    theme?: 'primary' | 'warning' | 'danger' | 'info';
    color?: string;
    modules: any[];
};

export type ModuleObject = {
    type:
        | 'section'
        | 'header'
        | 'divider'
        | 'action-group'
        | 'context'
        | 'file'
        | 'audio'
        | 'video'
        | 'countdown';
};

export class Card {
    theme = 'secondary';
    size = 'lg';
    modules: ModuleObject[] = [];
    color?: string;
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
            this.modules = card.modules;
        }
    }

    public static validate(content: CardObject): boolean {
        for (const module of content.modules) {
            if (Array.isArray(module)) return false; // TODO
        }
        return true;
    }

    public get output(): string {
        return JSON.stringify({
            type: 'card',
            theme: this.theme,
            size: this.size,
            modules: this.modules,
        });
    }
}
