import * as splitmix32 from "./splitmix32.ts";
import { validate32 } from "./uint32.ts";

/**
 * A state of a xoshiro128 PRNG.
 */
export type State = [number, number, number, number];

/**
 * A kind of a xoshiro128 PRNG.
 */
export const enum Kind {
    Plus = "xoshiro128plus",
    PlusPlus = "xoshiro128plusplus",
    StarStar = "xoshiro128starstar",
}

/**
 * A xoshiro128 PRNG.
 */
export interface Xoshiro128 {
    /**
     * The kind of the xoshiro128 algorithm.
     */
    readonly kind: Kind;

    /**
     * The seed used to initialize the PRNG.
     *
     * If the PRNG was not initialized with a seed, this property is `undefined`.
     */
    readonly seed: number | undefined;

    /**
     * The name of the PRNG. If the PRNG was initialized with a string, this
     * string is used as the name. Otherwise, this property is `undefined`.
     */
    readonly name: string | undefined;

    /**
     * Generates a random unsigned 32-bit integer as a number.
     *
     * @returns An unsigned 32-bit integer as a number.
     */
    next(): number;

    /**
     * Jumps the PRNG ahead 2^64 steps. This is equivalent to calling
     * {@link next()} 2^64 times without using the results, but faster.
     */
    jump(): void;

    /**
     * Jumps the PRNG ahead 2^96 steps. This is equivalent to calling
     * {@link next()} 2^96 times without using the results, but faster.
     */
    longJump(): void;

    /**
     * Generates a random floating-point number between 0 (inclusive) and 1
     * (exclusive).
     *
     * This is a drop-in replacement of `Math.random()`, but has only 32
     * bits of randomness in the upper bits of the fraction.
     *
     * @returns A floating-point number in the range [0, 1).
     */
    random(): number;

    /**
     * Saves the current state of the PRNG.
     *
     * @returns The current state of the PRNG.
     */
    save(): State;

    /**
     * Restores a previous state of the PRNG.
     *
     * The state must be guaranteed to be the result of a previous call to
     * {@link save()} on the same PRNG.
     *
     * @param state A previous state of the PRNG.
     */
    restore(state: State): void;

    /**
     * Creates a clone of the PRNG.
     *
     * @returns A clone of the PRNG.
     */
    clone(): Xoshiro128;

    /**
     * Resets the PRNG to the initial state.
     */
    reset(): void;
}

type Jump = readonly [number, number, number, number];

const JUMP = [
    0x8764000b,
    0xf542d2d3,
    0x6fa035c3,
    0x77f2db5b,
] as const;

const LONG_JUMP = [
    0xb523952e,
    0x0b6f099f,
    0xccf5a0ef,
    0x1c580662,
] as const;

function jumpWith(
    s: State,
    jump: Jump,
): void {
    let s0 = 0;
    let s1 = 0;
    let s2 = 0;
    let s3 = 0;

    for (let i = 0; i < jump.length; i++) {
        for (let b = 0; b < 32; b++) {
            if (jump[i] & (1 << b)) {
                s0 ^= s[0];
                s1 ^= s[1];
                s2 ^= s[2];
                s3 ^= s[3];
            }

            const t = s[1] << 9;

            s[2] ^= s[0];
            s[3] ^= s[1];
            s[1] ^= s[2];
            s[0] ^= s[3];

            s[2] ^= t;

            s[3] = (s[3] << 11) | (s[3] >>> 21);
        }
    }

    s[0] = s0 >>> 0;
    s[1] = s1 >>> 0;
    s[2] = s2 >>> 0;
    s[3] = s3 >>> 0;
}

export function jump(
    s: State,
): void {
    jumpWith(s, JUMP);
}

export function longJump(
    s: State,
): void {
    jumpWith(s, LONG_JUMP);
}

export function seedState(seed: number): State {
    const s = [seed] as splitmix32.State;

    const s0 = splitmix32.next(s);
    const s1 = splitmix32.next(s);
    const s2 = splitmix32.next(s);
    const s3 = splitmix32.next(s);

    return [s0, s1, s2, s3];
}

function validateState32(state: State) {
    validate32(state[0], "state[0]");
    validate32(state[1], "state[1]");
    validate32(state[2], "state[2]");
    validate32(state[3], "state[3]");
}

export function validateStateNonZero(state: State) {
    if (state[0] === 0 && state[1] === 0 && state[2] === 0 && state[3] === 0) {
        throw new RangeError("state must not be all zeroes");
    }
}

export function validateState(state: State) {
    validateStateNonZero(state);
    validateState32(state);
}

export function sanitizeState(state: State): State {
    if (state[0] === 0 && state[1] === 0 && state[2] === 0 && state[3] === 0) {
        return seedState(0);
    }

    validateState32(state);

    return state;
}
