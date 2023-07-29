import { array, SEED, shuffle } from "../const.ts";
import { random } from "xoshiro128/random";

const data = array();

Deno.bench(function benchShuffleXoshiro128Random() {
    random.reset(SEED);
    shuffle(data, () => random.random());
});
