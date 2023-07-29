import { Kind, xoshiro128 } from "xoshiro128";

// xoshiro128** (default)
const starstar = xoshiro128(1234, Kind.StarStar /* "xoshiro128starstar" */);
// xoshiro128++
const plusplus = xoshiro128(1234, Kind.PlusPlus /* "xoshiro128plusplus" */);
// xoshiro128+
const plus = xoshiro128(1234, Kind.Plus /* "xoshiro128plus" */);

console.assert(starstar.random() === 0.4488106195349246);
console.assert(plusplus.random() === 0.05153296561911702);
console.assert(plus.random() === 0.41102893161587417);
