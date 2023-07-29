# xoshiro128

[![npm](https://img.shields.io/npm/v/xoshiro128)](https://www.npmjs.com/package/xoshiro128)
[![deno](https://deno.land/badge/xoshiro128/version)](https://deno.land/x/xoshiro128)

A fast, seedable, non-cryptographic, pseudorandom number generator
for TypeScript.

```ts
import { xoshiro128 } from "xoshiro128";

// seed with 1234
const rng = xoshiro128(1234);

// always the same result
console.assert(rng.random() === 0.05153296561911702);
console.assert(rng.random() === 0.5920798229053617);
console.assert(rng.random() === 0.8060240163467824);
```

## Algorithms

### xoshiro128

This library implements xoshiro128 pseudorandom number generators (PRNGs)
designed and implemented in C by David Blackman and Sebastiano Vigna.

- [`xoshiro128++`]
- [`xoshiro128**`]
- [`xoshiro128+`]

[`xoshiro128++`]: https://prng.di.unimi.it/xoshiro128plusplus.c
[`xoshiro128**`]: https://prng.di.unimi.it/xoshiro128starstar.c
[`xoshiro128+`]: https://prng.di.unimi.it/xoshiro128plus.c

The default algorithm of this library is `xoshiro128**`. For more information
about xoshiro128 PRNGs, see: <https://prng.di.unimi.it/>

### MurmurHash3

For hashing strings, this library uses 32-bit (x86) version of [`MurmurHash3`]
designed and implemented in C++ by Austin Appleby. `splitmix32` which is used
this library to seed xoshiro128 PRNGs also uses `MurmurHash3`'s finalization
step.

[`MurmurHash3`]: https://github.com/aappleby/smhasher/blob/master/src/MurmurHash3.cpp

## Performance

Some benchmarks on [Deno] (V8) show that this implementation of xoshiro128 PRNGs
is as fast as `Math.random()` or even faster in some cases.

[Deno]: https://deno.land/

### Call `.random()` 1,000 times

```shell
deno bench benches/random
```

Results on GitHub Actions:

| Algorithm       | Average  | Min … Max           | P75      | P99      | P995     |
| --------------- | -------- | ------------------- | -------- | -------- | -------- |
| `Math.random()` | 11.19 µs | 10 µs … 875.52 µs   | 10.7 µs  | 19.4 µs  | 95.8 µs  |
| `xoshiro128++`  | 8.61 µs  | 8.3 µs … 404.51 µs  | 8.7 µs   | 10.4 µs  | 10.9 µs  |
| `xoshiro128**`  | 8.59 µs  | 8.3 µs … 329.31 µs  | 8.5 µs   | 9 µs     | 10.6 µs  |
| `xoshiro128+`   | 8.63 µs  | 8.3 µs … 381.91 µs  | 8.6 µs   | 10.5 µs  | 10.9 µs  |

<details>

<summary>deno bench benches/random</summary>

```
cpu: Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz
runtime: deno 1.35.2 (x86_64-unknown-linux-gnu)

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/internal/xoshiro128plus_bench.ts
benchmark                        time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------------- -----------------------------
benchXoshiro128PlusInternal       3.89 µs/iter        (3.86 µs … 4 µs)    3.9 µs      4 µs      4 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/internal/xoshiro128plusplus_bench.ts
benchmark                            time (avg)             (min … max)       p75       p99      p995
----------------------------------------------------------------------- -----------------------------
benchXoshiro128PlusPlusInternal       3.39 µs/iter      (3.36 µs … 3.6 µs)   3.39 µs    3.6 µs    3.6 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/internal/xoshiro128starstar_bench.ts
benchmark                            time (avg)             (min … max)       p75       p99      p995
----------------------------------------------------------------------- -----------------------------
benchXoshiro128StarStarInternal       3.37 µs/iter      (3.34 µs … 3.6 µs)   3.37 µs    3.6 µs    3.6 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/math_bench.ts
benchmark      time (avg)             (min … max)       p75       p99      p995
------------------------------------------------- -----------------------------
benchMath      11.19 µs/iter     (10 µs … 875.52 µs)   10.7 µs   19.4 µs   95.8 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/random/float_bench.ts
benchmark                       time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------------ -----------------------------
benchXoshiro128RandomFloat        8.6 µs/iter    (8.4 µs … 409.61 µs)    8.5 µs   10.6 µs     11 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/random/random_bench.ts
benchmark                  time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------- -----------------------------
benchXoshiro128Random       8.61 µs/iter    (8.3 µs … 346.81 µs)    8.5 µs   10.6 µs     11 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/xoshiro128plus_bench.ts
benchmark                time (avg)             (min … max)       p75       p99      p995
----------------------------------------------------------- -----------------------------
benchXoshiro128Plus       8.63 µs/iter    (8.3 µs … 381.91 µs)    8.6 µs   10.5 µs   10.9 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/xoshiro128plusplus_bench.ts
benchmark                    time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------------- -----------------------------
benchXoshiro128PlusPlus       8.61 µs/iter    (8.3 µs … 404.51 µs)    8.7 µs   10.4 µs   10.9 µs

file:///home/runner/work/xoshiro128/xoshiro128/benches/random/xoshiro128starstar_bench.ts
benchmark                    time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------------- -----------------------------
benchXoshiro128StarStar       8.59 µs/iter    (8.3 µs … 329.31 µs)    8.5 µs      9 µs   10.6 µs
```

</details>

### Shuffle an array of 1,000,000 elements

```shell
deno bench benches/shuffle
```

Results on GitHub Actions:

| Algorithm       | Average  | Min … Max           | P75      | P99      | P995     |
| --------------- | -------- | ------------------- | -------- | -------- | -------- |
| `Math.random()` | 17.99 ms | 17.57 ms … 19.38 ms | 18.08 ms | 19.38 ms | 19.38 ms |
| `xoshiro128++`  | 19.03 ms | 18.69 ms … 20.56 ms | 19.03 ms | 20.56 ms | 20.56 ms |
| `xoshiro128**`  | 17.35 ms | 16.9 ms … 19.54 ms  | 17.45 ms | 19.54 ms | 19.54 ms |
| `xoshiro128+`   | 16.48 ms | 16.32 ms … 18.44 ms | 16.47 ms | 18.44 ms | 18.44 ms |

<details>

<summary>deno bench benches/shuffle</summary>

```
cpu: Intel(R) Xeon(R) Platinum 8272CL CPU @ 2.60GHz
runtime: deno 1.35.2 (x86_64-unknown-linux-gnu)

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/internal/xoshiro128plus_bench.ts
benchmark                               time (avg)             (min … max)       p75       p99      p995
-------------------------------------------------------------------------- -----------------------------
benchShuffleXoshiro128PlusInternal      13.57 ms/iter   (13.38 ms … 14.34 ms)  13.65 ms  14.34 ms  14.34 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/internal/xoshiro128plusplus_bench.ts
benchmark                                   time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------------------------ -----------------------------
benchShuffleXoshiro128PlusPlusInternal      14.02 ms/iter   (13.92 ms … 15.42 ms)  13.97 ms  15.42 ms  15.42 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/internal/xoshiro128starstar_bench.ts
benchmark                                   time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------------------------ -----------------------------
benchShuffleXoshiro128StarStarInternal      13.87 ms/iter    (13.7 ms … 14.76 ms)  13.97 ms  14.76 ms  14.76 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/math_bench.ts
benchmark             time (avg)             (min … max)       p75       p99      p995
-------------------------------------------------------- -----------------------------
benchShuffleMath      17.99 ms/iter   (17.57 ms … 19.38 ms)  18.08 ms  19.38 ms  19.38 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/random/random_bench.ts
benchmark                         time (avg)             (min … max)       p75       p99      p995
-------------------------------------------------------------------- -----------------------------
benchShuffleXoshiro128Random      20.12 ms/iter   (19.83 ms … 22.45 ms)  20.12 ms  22.45 ms  22.45 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/random/uniform_bench.ts
benchmark                                time (avg)             (min … max)       p75       p99      p995
--------------------------------------------------------------------------- -----------------------------
benchShuffleXoshiro128RandomUniform      32.12 ms/iter   (31.64 ms … 33.05 ms)   32.2 ms  33.05 ms  33.05 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/xoshiro128plus_bench.ts
benchmark                       time (avg)             (min … max)       p75       p99      p995
------------------------------------------------------------------ -----------------------------
benchShuffleXoshiro128Plus      16.48 ms/iter   (16.32 ms … 18.44 ms)  16.47 ms  18.44 ms  18.44 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/xoshiro128plusplus_bench.ts
benchmark                           time (avg)             (min … max)       p75       p99      p995
---------------------------------------------------------------------- -----------------------------
benchShuffleXoshiro128PlusPlus      19.03 ms/iter   (18.69 ms … 20.56 ms)  19.03 ms  20.56 ms  20.56 ms

file:///home/runner/work/xoshiro128/xoshiro128/benches/shuffle/xoshiro128starstar_bench.ts
benchmark                           time (avg)             (min … max)       p75       p99      p995
---------------------------------------------------------------------- -----------------------------
benchShuffleXoshiro128StarStar      17.35 ms/iter    (16.9 ms … 19.54 ms)  17.45 ms  19.54 ms  19.54 ms
```

</details>

## Usage

### Generate

```ts
import { xoshiro128 } from "xoshiro128";

// seed with 1234
const rng = xoshiro128(1234);

// generate random numbers in [0, 1)
console.assert(rng.random() === 0.4488106195349246);
console.assert(rng.random() === 0.6467702996451408);
console.assert(rng.random() === 0.3171623020898551);
```

### Seed

```ts
import { xoshiro128 } from "xoshiro128";

// number
xoshiro128(1234);

// default: seed = 0
xoshiro128();

// string: seed = hash("hello") = 3619887497
xoshiro128("hello");

// random seed
xoshiro128({ random: true });
```

### State

```ts
import { xoshiro128 } from "xoshiro128";

const rng = xoshiro128(1234);

// save state
const state = rng.save();

// restore state
rng.restore(state);

// initialize with state
const rng2 = xoshiro128(state);
```

### Algorithm

```ts
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
```

### Low-level API

```ts
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
```

### High-level API (`xoshiro128/random`)

```ts
import { random } from "xoshiro128/random";

// default: 0
random.reset(1234);

// generate 10 random integers in [1, 100]
for (const n of random.iter(10).int(1, 100)) {
    console.log(n);
}

// integer in [1, 100]
random.int(1, 100);

// float in [0, 100)
random.float(0, 100);

// true or false
random.boolean();

// string of length 10
random.string(10, "0123456789");

// array of length 10
random.array(["a", "b", "c", "d", "e"], 10);

// pick an element from the array
random.pick(["a", "b", "c", "d", "e"]);

// sample 3 elements from the array without replacement
random.sample(["a", "b", "c", "d", "e"], 3);

// shuffle the array in place
random.shuffle(["a", "b", "c", "d", "e"]);

// shuffle the array and return a new array
random.shuffled(["a", "b", "c", "d", "e"]);

// save state
const state = random.save();

// restore state
random.restore(state);

// clone
const clone = random.clone();
```

### Deno

`xoshiro128`:

```ts
import { xoshiro128 } from "https://deno.land/x/xoshiro128/mod.ts";
```

`xoshiro128/random`:

```ts
import { random } from "https://deno.land/x/xoshiro128/random.ts";
```

## Development

This library uses [Deno] for development.

[Deno]: https://deno.land/

### Build

To build the npm package (`0.0.0` for example):

```shell
deno run -A scripts/build_npm.ts 0.0.0
```

### Test

To run tests:

```shell
deno test
```

### Benchmark

To run benchmarks:

```shell
deno bench
```

## License

Licensed under either of

- Apache License, Version 2.0
  ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT License
  ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
