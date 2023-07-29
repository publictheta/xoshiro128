import { ITERATION } from "./const.ts";

Deno.bench(function benchMath() {
    for (let i = 0; i < ITERATION; i++) {
        Math.random();
    }
});
