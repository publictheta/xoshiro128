import { array, shuffle, STATE } from "../const.ts";
import { Xoshiro128PlusPlus } from "xoshiro128";

const data = array();

Deno.bench(function benchShuffleXoshiro128PlusPlusInternal() {
    const rng = new Xoshiro128PlusPlus(STATE());

    shuffle(
        data,
        () => rng.random(),
    );
});
