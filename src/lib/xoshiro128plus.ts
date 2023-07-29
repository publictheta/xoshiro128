import { seedState, validateState } from "./xoshiro128.ts";
import { jump, Kind, longJump, State, Xoshiro128 } from "./xoshiro128.ts";

/**
 * A xoshiro128+ PRNG.
 */
export class Xoshiro128Plus implements Xoshiro128 {
    /**
     * Creates a xoshiro128+ PRNG.
     *
     * CAUTION: This constructor is intended to be used internally. It does not
     * validate any of the arguments. Use {@link xoshiro128()} instead to create a
     * xoshiro128 PRNG.
     *
     * @param s The internal state of the PRNG.
     * @param i The seed used to initialize the state, or the initial state passed to the constructor.
     * @param n The name of the PRNG.
     */
    constructor(
        /**
         * The internal state of the PRNG.
         *
         * A state must be an array of four numbers, each representing an unsigned
         * 32-bit integer.
         */
        private s: State,
        /**
         * The seed used to initialize the PRNG, or the initial state passed to the
         * constructor.
         */
        private i?: number | State,
        /**
         * The name of the PRNG.
         */
        private n?: string,
    ) {}

    get kind(): Kind.Plus {
        return Kind.Plus;
    }

    get seed(): number | undefined {
        return typeof this.i === "number" ? this.i : undefined;
    }

    get name(): string | undefined {
        return this.n;
    }

    next(): number {
        const s = this.s;

        const s0 = s[0];
        const s1 = s[1];
        const s2 = s[2];
        const s3 = s[3];

        const r = (s0 + s3) >>> 0;

        const t2 = s2 ^ s0;
        const t3 = s3 ^ s1;

        s[1] = s1 ^ t2;
        s[0] = s0 ^ t3;
        s[2] = t2 ^ (s1 << 9);
        s[3] = (t3 << 11) | (t3 >>> 21);

        return r;
    }

    jump(): void {
        jump(this.s);
    }

    longJump(): void {
        longJump(this.s);
    }

    random(): number {
        return this.next() * 2.3283064365386963e-10; // 2^-32
    }

    save(): State {
        const s = this.s;
        return [s[0] >>> 0, s[1] >>> 0, s[2] >>> 0, s[3] >>> 0];
    }

    restore(state: State): void {
        validateState(state);
        this.s = [...state];
    }

    clone(): Xoshiro128Plus {
        return new Xoshiro128Plus(
            [...this.s],
            this.i,
            this.n,
        );
    }

    reset(): void {
        if (typeof this.i === "number") {
            this.s = seedState(this.i);
        } else if (Array.isArray(this.i)) {
            this.s = [...this.i];
        } else {
            throw new Error("No initial state or seed was provided");
        }
    }
}
