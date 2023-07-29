import { ITERATION, STATE } from "../const.ts";
import { Xoshiro128PlusPlus } from "xoshiro128";

Deno.bench(function benchXoshiro128PlusPlusInternal() {
    const rng = new Xoshiro128PlusPlus(STATE());

    for (let i = 0; i < ITERATION; i++) {
        rng.random();
    }
});
