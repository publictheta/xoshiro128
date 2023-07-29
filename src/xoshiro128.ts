import * as murmur3 from "./lib/murmur3.ts";
import { validate32 } from "./lib/uint32.ts";

import {
    Kind,
    sanitizeState,
    seedState,
    State,
    Xoshiro128,
} from "./lib/xoshiro128.ts";
import { Xoshiro128Plus } from "./lib/xoshiro128plus.ts";
import { Xoshiro128PlusPlus } from "./lib/xoshiro128plusplus.ts";
import { Xoshiro128StarStar } from "./lib/xoshiro128starstar.ts";

let _isLittleEndian: boolean | undefined;

function isLittleEndian(): boolean {
    if (_isLittleEndian === undefined) {
        const u8 = new Uint8Array(2);

        // 0x01 0x00
        u8[0] = 1;
        u8[1] = 0;

        const u16 = new Uint16Array(u8.buffer);

        // 0x0001
        _isLittleEndian = u16[0] === 1;
    }

    return _isLittleEndian;
}

function hash(s: string): number {
    let pos = 0;

    let next;

    if (isLittleEndian()) {
        next = () => s.charCodeAt(pos++) | s.charCodeAt(pos++) << 16;
    } else {
        next = () => {
            const c0 = s.charCodeAt(pos++);
            const c1 = s.charCodeAt(pos++);

            return (c0 & 0xff) << 24 | (c0 >>> 8) << 16 | (c1 & 0xff) << 8 |
                (c1 >>> 8);
        };
    }

    return murmur3.hash(
        s.length * 2,
        next,
        () => {
            const c = s.charCodeAt(pos++);
            return [c & 0xff, c >>> 8];
        },
    );
}

function randomSeed(): number {
    return (Math.random() * 0x100000000) >>> 0;
}

/**
 * Options for creating a xoshiro128 PRNG.
 *
 * - `number` or `{ seed: number }`: Used as a seed.
 * - `string` or `{ name: string }`: Used as a name and
 *   hashed to generate a seed.
 * - `State` or `{ state: State, seed?: number, name?: string }`:
 *   `State` or `state` is used as an initial state. `seed` and
 *   `name` are optional and stored only for reference.
 * - `{ random: true }`: Generates a random seed.
 *
 * The optional `kind` property specifies the algorithm of the PRNG.
 */
export type Options = number | string | State | {
    kind?: Kind;
} | {
    kind?: Kind;
    seed?: number;
} | {
    kind?: Kind;
    name?: string;
} | {
    kind?: Kind;
    state: State;
    seed?: number;
    name?: string;
} | {
    kind?: Kind;
    random: true;
};

/**
 * Creates a xoshiro128 PRNG.
 *
 * @param options The options for creating the PRNG.
 * @param kind The algorithm of the PRNG. If specified,
 * it overrides the kind specified in {@link options}.
 * @returns A xoshiro128 PRNG.
 *
 * @example
 *
 * ```ts
 * // seed with 0 (default)
 * xoshiro128();
 * ```
 *
 * @example
 *
 * ```ts
 * // seed with a number
 * xoshiro128(1234);
 * ```
 *
 * @example
 *
 * ```ts
 * // seed with a string (its hash is used as a seed)
 * xoshiro128("hello");
 * ```
 *
 * @example
 *
 * ```ts
 * // random seed
 * xoshiro128({ random: true });
 * ```
 *
 * @example
 *
 * ```ts
 * // specify the algorithm
 * xoshiro128({ kind: Kind.PlusPlus });
 * xoshiro128({ kind: Kind.StarStar });
 * xoshiro128({ kind: Kind.Plus });
 * ```
 *
 * @example
 *
 * ```ts
 * // set state manually (all zeroes are not allowed; fallback to a seed of 0)
 * xoshiro128([ 1889054206, 3098527212, 4145563210, 4171268909 ]);
 * ```
 *
 * @example
 *
 * ```ts
 * // set state manually and store the seed used to generate the state
 * xoshiro128({ state: [ 1889054206, 3098527212, 4145563210, 4171268909 ], seed: 1234 });
 * ```
 */
export function xoshiro128(
    options?: Options,
    kind?: Kind,
): Xoshiro128 {
    let state: State | undefined;
    let seed: number | undefined;
    let name: string | undefined;

    if (options === undefined) {
        seed = 0;
    } else if (Array.isArray(options)) {
        state = options;
    } else if (typeof options === "number") {
        seed = options;
    } else if (typeof options === "string") {
        name = options;
    } else if (typeof options === "object") {
        if ("state" in options && Array.isArray(options.state)) {
            state = options.state;
            seed = options.seed;
            name = options.name;
        } else if ("random" in options && options.random) {
            seed = randomSeed();
        } else if ("seed" in options && typeof options.seed === "number") {
            seed = options.seed;
        } else if ("name" in options && typeof options.name === "string") {
            name = options.name;
        }

        if (kind === undefined) {
            kind = options.kind;
        }
    }

    if (state === undefined) {
        if (seed === undefined) {
            seed = name === undefined ? 0 : hash(name);
        } else {
            validate32(seed, "seed");
        }

        state = seedState(seed);
    } else {
        state = sanitizeState(state);
    }

    if (kind === undefined) {
        kind = Kind.StarStar;
    }

    switch (kind) {
        case Kind.Plus:
            return new Xoshiro128Plus(state, seed ?? [...state], name);
        case Kind.PlusPlus:
            return new Xoshiro128PlusPlus(state, seed ?? [...state], name);
        case Kind.StarStar:
            return new Xoshiro128StarStar(state, seed ?? [...state], name);
        default:
            throw new Error(`unknown algorithm: ${kind}`);
    }
}
