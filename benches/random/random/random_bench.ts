import { ITERATION, SEED } from "../const.ts";
import { Random } from "xoshiro128/random";

Deno.bench(function benchXoshiro128Random() {
    const rng = new Random(SEED);

    for (let i = 0; i < ITERATION; i++) {
        rng.random();
    }
});
