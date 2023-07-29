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

// should be the same
console.assert(random.float(0, 1) === clone.float(0, 1));
