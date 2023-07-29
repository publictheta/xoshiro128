import { ITERATION, SEED } from "./const.ts";
import { Kind, xoshiro128 } from "xoshiro128";

Deno.bench(function benchXoshiro128Plus() {
    const rng = xoshiro128(SEED, Kind.Plus);

    for (let i = 0; i < ITERATION; i++) {
        rng.random();
    }
});
