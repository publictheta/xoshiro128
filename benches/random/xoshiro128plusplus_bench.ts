import { ITERATION, SEED } from "./const.ts";
import { Kind, xoshiro128 } from "xoshiro128";

Deno.bench(function benchXoshiro128PlusPlus() {
    const rng = xoshiro128(SEED, Kind.PlusPlus);

    for (let i = 0; i < ITERATION; i++) {
        rng.random();
    }
});
