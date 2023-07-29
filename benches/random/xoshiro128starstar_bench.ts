import { ITERATION, SEED } from "./const.ts";
import { Kind, xoshiro128 } from "xoshiro128";

Deno.bench(function benchXoshiro128StarStar() {
    const rng = xoshiro128(SEED, Kind.StarStar);

    for (let i = 0; i < ITERATION; i++) {
        rng.random();
    }
});
