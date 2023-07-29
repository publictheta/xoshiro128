import { ITERATION, STATE } from "../const.ts";
import { Xoshiro128StarStar } from "xoshiro128";

Deno.bench(function benchXoshiro128StarStarInternal() {
    const rng = new Xoshiro128StarStar(STATE());

    for (let i = 0; i < ITERATION; i++) {
        rng.random();
    }
});
