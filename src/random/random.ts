import { Options, xoshiro128 } from "../xoshiro128.ts";
import * as rng from "../lib/xoshiro128.ts";

/**
 * A state of {@link Random}.
 */
export interface State {
    kind: rng.Kind;
    state: rng.State;
    seed?: number;
    name?: string;
}

/**
 * Generates a random integer in the range `[0, max)`.
 *
 * `max` must be less than `2^32` and greater than `0`.
 *
 * @param rng A {@link Xoshiro128} instance.
 * @param max The maximum value (exclusive).
 * @returns A random integer in the range `[0, max)`.
 */
function uniform(rng: rng.Xoshiro128, max: number): number {
    const end = 0x100000000 - (0x100000000 % max);

    let n = rng.next();

    while (n >= end) {
        n = rng.next();
    }

    return n % max;
}

/**
 * Generates a random boolean.
 *
 * @param rng A {@link Xoshiro128} instance.
 * @returns A random boolean.
 */
function boolean(rng: rng.Xoshiro128): boolean {
    return rng.next() < 0x80000000;
}

/**
 * Validates the arguments of {@link int}.
 *
 * @param min The minimum value (inclusive).
 * @param max The maximum value (inclusive).
 */
function validateInt(min: number, max: number) {
    if (!Number.isSafeInteger(min)) {
        throw new Error("min must be an integer");
    }

    if (!Number.isSafeInteger(max)) {
        throw new Error("max must be an integer");
    }

    if (min > max) {
        throw new Error("min must be less than or equal to max");
    }

    if (max - min >= 0x100000000) {
        throw new Error("max - min must be less than 2^32");
    }
}

/**
 * Generates a random integer in the range `[min, max]`.
 *
 * @param rng A {@link Xoshiro128} instance.
 * @param min The minimum value (inclusive).
 * @param max The maximum value (inclusive).
 * @returns A random integer in the range `[min, max]`.
 */
function int(rng: rng.Xoshiro128, min: number, max: number): number {
    return min + uniform(rng, max - min + 1);
}

/**
 * Generates a random float in the range `[min, max)`.
 *
 * @param rng A {@link Xoshiro128} instance.
 * @param min The minimum value (inclusive).
 * @param max The maximum value (exclusive).
 * @returns A random float in the range `[min, max)`.
 */
function float(rng: rng.Xoshiro128, min: number, max: number): number {
    return min + rng.random() * (max - min);
}

/**
 * Returns a random element from the given array.
 *
 * @param rng A {@link Xoshiro128} instance.
 * @param items An array of items.
 * @returns A random element from the given array.
 */
function pick<T>(rng: rng.Xoshiro128, items: T[]): T {
    return items[uniform(rng, items.length)];
}

/**
 * A utility wrapper for RNGs.
 */
export class Random {
    /**
     * The underlying RNG.
     */
    private rng: rng.Xoshiro128;

    /**
     * Creates a new {@link Random} instance.
     *
     * @param options Options for xoshiro128,
     * or an instance of {@link Xoshiro128}.
     */
    constructor(options?: Options | rng.Xoshiro128) {
        if (typeof options === "object" && "next" in options) {
            this.rng = options;
            return;
        }

        this.rng = xoshiro128(options);
    }

    /**
     * Resets the underlying RNG. If `options` is given,
     * the RNG is reinitialized with the given options.
     *
     * @param options
     */
    reset(options?: Options): void {
        if (options === undefined) {
            this.rng.reset();
            return;
        }

        this.rng = xoshiro128(options);
    }

    /**
     * Saves the current state of {@link Random}.
     *
     * @returns The current state of {@link Random}
     */
    save(): State {
        return {
            kind: this.rng.kind,
            state: this.rng.save(),
            seed: this.rng.seed,
            name: this.rng.name,
        };
    }

    /**
     * Restores a previous state of {@link Random}.
     *
     * @param state A previous state of {@link Random}.
     */
    restore(state: State): void {
        this.rng = xoshiro128(state);
    }

    /**
     * Creates a clone of this {@link Random} instance.
     *
     * @returns A new instance of {@link Random} with the same state.
     */
    clone(): Random {
        return new Random(this.rng.clone());
    }

    /**
     * Returns a random integer in the range `[min, max]`.
     *
     * The length of the range must be less than `2^32`.
     *
     * @param min The minimum value (inclusive).
     * @param max The maximum value (inclusive).
     * @returns A random integer in the range `[min, max]`.
     */
    int(min: number, max: number): number {
        if (min === max) {
            return min;
        }

        validateInt(min, max);

        return int(this.rng, min, max);
    }

    /**
     * Returns a random float in the range `[0, 1)`.
     *
     * This is a drop-in replacement of `Math.random()`, but has only 32
     * bits of randomness in the upper bits of the fraction.
     *
     * @returns A random float in the range `[0, 1)`.
     */
    random(): number {
        return this.rng.random();
    }

    /**
     * Returns a random float in the range `[min, max)`.
     *
     * The precision of the result is 32 bits. The lower bits of the
     * fraction are not random and should not be relied upon.
     *
     * @param min The minimum value (inclusive).
     * @param max The maximum value (exclusive).
     * @returns A random float in the range `[min, max)`.
     */
    float(min: number, max: number): number {
        if (min === max) {
            return min;
        }

        return float(this.rng, min, max);
    }

    /**
     * Returns `true` or `false` with equal probability.
     *
     * @returns `true` or `false`
     */
    boolean(): boolean {
        return boolean(this.rng);
    }

    /**
     * Returns a random string of length `length` from the given characters.
     *
     * This method is not aware of Unicode and uses UTF-16 code units.
     *
     * @param length The length of the string.
     * @param alphabet A string containing characters to choose from.
     * @returns A random string of length `length` from the given characters.
     */
    string(length: number, alphabet: string): string {
        let result = "";

        if (alphabet.length === 0) {
            return result;
        }

        const rng = this.rng;

        for (let i = 0; i < length; i++) {
            result += alphabet[uniform(rng, alphabet.length)];
        }

        return result;
    }

    /**
     * Returns a random array of `length` elements from the given array.
     *
     * @param items An array containing elements to choose from.
     * @param length The length of the array to generate.
     * @returns A random array of `length` elements from the given array.
     */
    array<T>(items: T[], length: number): T[] {
        const result = new Array(length);

        if (items.length === 0 || items.length === 1) {
            return result.fill(items[0]);
        }

        const rng = this.rng;

        for (let i = 0; i < length; i++) {
            result[i] = items[uniform(rng, items.length)];
        }

        return result;
    }

    /**
     * Returns a random element from the given array.
     *
     * @param items An array of items.
     * @returns A random element from the given array.
     */
    pick<T>(items: T[]): T {
        if (items.length === 0 || items.length === 1) {
            return items[0];
        }

        return pick(this.rng, items);
    }

    /**
     * Does an in-place Fisher-Yates (Knuth) shuffle of the given array.
     *
     * ```
     * 0           start        end          items.length
     * v           v            v             v
     *  [ mutated ] [ shuffled ] [ untouched ]
     * ```
     *
     * @param items An array of items.
     * @param start The start index (inclusive).
     * @param end The end index (exclusive).
     */
    private shuffleInPlace<T>(items: T[], start = 0, end = items.length) {
        const rng = this.rng;

        for (let i = end - 1; i > start; i--) {
            const j = uniform(rng, i + 1);

            const tmp = items[i];
            items[i] = items[j];
            items[j] = tmp;
        }
    }

    /**
     * Shuffles the given array in-place.
     *
     * @param items An array of items.
     * @returns The reference to the given array.
     */
    shuffle<T>(items: T[]): T[] {
        if (items.length === 0 || items.length === 1) {
            return items;
        }

        this.shuffleInPlace(items);

        return items;
    }

    /**
     * Returns a shuffled copy of the given array.
     *
     * @param items An array of items.
     * @returns A new array containing the shuffled elements.
     */
    shuffled<T>(items: T[]): T[] {
        return this.shuffle(items.slice());
    }

    /**
     * Returns `k` random elements from the given array
     * without replacement in a random order.
     *
     * If `k` is greater than or equal to the length of `items`,
     * this method returns a shuffled array of `items`.
     *
     * @param items An array of items.
     * @param k The number of elements to sample.
     * @returns `k` random elements from the given array.
     */
    sample<T>(items: T[], k: number): T[] {
        if (k === 0) {
            return [];
        }

        if (k === 1) {
            return [this.pick(items)];
        }

        if (items.length === 0 || items.length === 1) {
            return new Array(k).fill(items[0]);
        }

        items = items.slice();

        if (k >= items.length) {
            return this.shuffle(items);
        }

        const start = items.length - k;
        this.shuffleInPlace(items, start);
        return items.slice(start);
    }

    /**
     * Returns an iterator interface for this {@link Random} instance.
     *
     * @param n The number of items to generate.
     * @returns An iterator interface.
     */
    iter(n: number): Iter {
        return new Iter(this.rng, n);
    }
}

/**
 * An iterator interface for {@link Random}.
 */
export class Iter {
    /**
     * The underlying RNG.
     */
    private rng: rng.Xoshiro128;

    /**
     * The number of items to generate.
     */
    private n: number;

    /**
     * Creates a new {@link Iter} instance.
     *
     * @param random The underlying {@link Random} instance.
     * @param n The number of items to generate.
     */
    constructor(rng: rng.Xoshiro128, n: number) {
        this.rng = rng;
        this.n = n;
    }

    /**
     * Generates `n` random integers in the range `[min, max]`.
     *
     * @param min The minimum value (inclusive).
     * @param max The maximum value (inclusive).
     */
    *int(min: number, max: number): IterableIterator<number> {
        if (min === max) {
            for (let i = this.n; i > 0; i--) {
                yield min;
            }

            return;
        }

        validateInt(min, max);

        const rng = this.rng;

        for (let i = this.n; i > 0; i--) {
            yield int(rng, min, max);
        }
    }

    /**
     * Generates `n` random floats in the range `[0, 1)`.
     */
    *random(): IterableIterator<number> {
        const rng = this.rng;

        for (let i = this.n; i > 0; i--) {
            yield rng.random();
        }
    }

    /**
     * Generates `n` random floats in the range `[min, max)`.
     *
     * @param min The minimum value (inclusive).
     * @param max The maximum value (exclusive).
     */
    *float(min: number, max: number): IterableIterator<number> {
        if (min === max) {
            for (let i = this.n; i > 0; i--) {
                yield min;
            }

            return;
        }

        const rng = this.rng;

        for (let i = this.n; i > 0; i--) {
            yield float(rng, min, max);
        }
    }

    /**
     * Generates `n` random booleans.
     */
    *boolean(): IterableIterator<boolean> {
        const rng = this.rng;

        for (let i = this.n; i > 0; i--) {
            yield boolean(rng);
        }
    }

    /**
     * Generates `n` random elements from the given array.
     *
     * @param items An array of items.
     */
    *pick<T>(items: T[]): IterableIterator<T> {
        if (items.length === 0 || items.length === 1) {
            for (let i = 0; i < this.n; i++) {
                yield items[0];
            }

            return;
        }

        const rng = this.rng;

        for (let i = this.n; i > 0; i--) {
            yield pick(rng, items);
        }
    }
}

/**
 * The default {@link Random} instance.
 */
export const random = new Random();
