import { array, SEED, shuffle } from "./const.ts";
import { Kind, xoshiro128 } from "xoshiro128";

const data = array();

Deno.bench(function benchShuffleXoshiro128StarStar() {
    const rng = xoshiro128(SEED, Kind.StarStar);

    shuffle(
        data,
        () => rng.random(),
    );
});
