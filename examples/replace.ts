import { xoshiro128 } from "xoshiro128";

const rng = xoshiro128(1234);

Math.random = () => rng.random();

// always the same result
console.assert(Math.random() === 0.4488106195349246);
console.assert(Math.random() === 0.6467702996451408);
console.assert(Math.random() === 0.3171623020898551);
