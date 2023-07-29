import { xoshiro128 } from "xoshiro128";

// seed with 1234
const rng = xoshiro128(1234);

// generate random numbers in [0, 1)
console.assert(rng.random() === 0.4488106195349246);
console.assert(rng.random() === 0.6467702996451408);
console.assert(rng.random() === 0.3171623020898551);
