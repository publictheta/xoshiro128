import { ITERATION, STATE } from "../const.ts";
import { Xoshiro128Plus } from "xoshiro128";

Deno.bench(function benchXoshiro128PlusInternal() {
    const rng = new Xoshiro128Plus(STATE());

    const out = new Array(1);

    for (let i = 0; i < ITERATION; i++) {
        out[0] = rng.random();
    }
});
