import { xoshiro128 } from "xoshiro128";

const rng = xoshiro128(1234);

// save state
const state = rng.save();

// restore state
rng.restore(state);

// clone
const clone = rng.clone();

// initialize with state
const rng2 = xoshiro128(state);

// should be the same
console.assert(clone.random() === rng2.random());
