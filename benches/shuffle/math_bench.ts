import { array, shuffle } from "./const.ts";

const data = array();

Deno.bench(function benchShuffleMath() {
    shuffle(
        data,
        Math.random,
    );
});
