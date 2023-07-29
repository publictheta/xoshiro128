import { array, shuffle, STATE } from "../const.ts";
import { Xoshiro128StarStar } from "xoshiro128";

const data = array();

Deno.bench(function benchShuffleXoshiro128StarStarInternal() {
    const rng = new Xoshiro128StarStar(STATE());

    shuffle(
        data,
        () => rng.random(),
    );
});
