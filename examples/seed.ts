import { xoshiro128 } from "xoshiro128";

// number
xoshiro128(1234);

// default: seed = 0
xoshiro128();

// string: seed = hash("hello") = 3619887497
xoshiro128("hello");

// random seed
xoshiro128({ random: true });
