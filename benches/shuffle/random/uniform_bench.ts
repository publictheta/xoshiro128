import { array, SEED } from "../const.ts";
import { random } from "xoshiro128/random";

const data = array();

Deno.bench(function benchShuffleXoshiro128RandomUniform() {
    random.reset(SEED);
    random.shuffle(data);
});
