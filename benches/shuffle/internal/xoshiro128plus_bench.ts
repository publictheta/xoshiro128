import { array, shuffle, STATE } from "../const.ts";
import { Xoshiro128Plus } from "xoshiro128";

const data = array();

Deno.bench(function benchShuffleXoshiro128PlusInternal() {
    const rng = new Xoshiro128Plus(STATE());

    shuffle(
        data,
        () => rng.random(),
    );
});
