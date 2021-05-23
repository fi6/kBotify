export function mentionById(
    id: string,
    preSpace = false,
    postSpace = true
): string {
    return `${preSpace && ' '}(met)${id}(met)${postSpace && ' '}`

export {};
