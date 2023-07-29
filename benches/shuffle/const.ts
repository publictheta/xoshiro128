export const SEED = 1234 as const;
export const STATE = () => [1, 2, 3, 4] as [number, number, number, number];
export const ITERATION = 1_000_000 as const;

export function shuffle(items: number[], random: () => number) {
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(random() * i);

        const tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
}

export function array(length = ITERATION): number[] {
    return [...Array(length).keys()];
}
