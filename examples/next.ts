import { xoshiro128 } from "xoshiro128";

const rng = xoshiro128(1234);

// generate 32-bit unsigned integer
console.assert(rng.next() === 1927626933);
console.assert(rng.next() === 2777857285);
console.assert(rng.next() === 1362201715);

// jump ahead by 2^64 steps
rng.jump();

// jump ahead by 2^96 steps
rng.longJump();
