export function mentionById(
    id: string,
    preSpace = false,
    postSpace = true
): string {
    return ''.concat(
        preSpace ? ' ' : '',
        `(met)${id}(met)`,
        postSpace ? ' ' : ''
    );
}

export {};
