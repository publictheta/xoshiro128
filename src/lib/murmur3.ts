export function hash(
    len: number,
    next: () => number,
    remainder: () => ArrayLike<number>,
    seed = 0,
): number {
    let h = seed;

    const c1 = 0xcc9e2d51;
    const c2 = 0x1b873593;

    // ----------
    // body

    const num = len >>> 2;

    for (let i = 0; i < num; i++) {
        let k = next();

        k = Math.imul(k, c1);
        k = (k << 15) | (k >>> 17);
        k = Math.imul(k, c2);

        h ^= k;
        h = (h << 13) | (h >>> 19);
        h = Math.imul(h, 5) + 0xe6546b64;
    }

    // ----------
    // tail

    let k = 0;

    const tail = remainder();

    switch (len & 3) {
        case 3:
            k ^= tail[2] << 16;
            // fallthrough
        case 2:
            k ^= tail[1] << 8;
            // fallthrough
        case 1:
            k ^= tail[0];
            k = Math.imul(k, c1);
            k = (k << 15) | (k >>> 17);
            k = Math.imul(k, c2);
            h ^= k;
    }

    // ----------
    // finalization

    h ^= len;

    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;

    return h >>> 0;
}
