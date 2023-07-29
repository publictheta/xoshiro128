import {
    assert,
    assertEquals,
    assertThrows,
} from "https://deno.land/std/assert/mod.ts";
import { Random } from "./random.ts";
import { xoshiro128 } from "../xoshiro128.ts";

Deno.test(function testRandomRandom() {
    const random = new Random();

    for (let i = 0; i < 100; i++) {
        const n = random.random();
        assert(0 <= n && n < 1);
    }

    for (const n of random.iter(100).random()) {
        assert(0 <= n && n < 1);
    }
});

Deno.test(function testRandomBoolean() {
    const random1 = new Random();
    const random2 = new Random();

    const result1 = [];

    for (let i = 0; i < 100; i++) {
        result1.push(random1.boolean());
    }

    const result2 = [];

    for (const v of random2.iter(100).boolean()) {
        result2.push(v);
    }

    assertEquals(result1, result2);
});

Deno.test(function testRandomInt() {
    const random = new Random();

    assertEquals(random.int(0, 0), 0);

    for (let i = 0; i < 100; i++) {
        const n = random.int(0, 2);
        assert(0 <= n && n <= 2);
    }

    for (let i = 0; i < 100; i++) {
        const n = random.int(0, 0x8000_0000);
        assert(0 <= n && n <= 0x8000_0000);
    }

    assertThrows(() => random.int(0, 0x1_0000_0000));
    assertThrows(() => random.int(0, -1));

    assertThrows(() => random.int(0, 0.5));
    assertThrows(() => random.int(0, Infinity));
    assertThrows(() => random.int(0, -Infinity));
    assertThrows(() => random.int(0, NaN));

    assertThrows(() => random.int(0.5, 0));
    assertThrows(() => random.int(Infinity, 0));
    assertThrows(() => random.int(-Infinity, 0));
    assertThrows(() => random.int(NaN, 0));

    assertThrows(() => random.int(0, Number.MAX_SAFE_INTEGER + 1));
    assertThrows(() => random.int(0, Number.MIN_SAFE_INTEGER - 1));
});

Deno.test(function testRandomIterInt() {
    const random = new Random();

    let count;

    count = 0;

    for (const n of random.iter(1).int(0, 0)) {
        assertEquals(n, 0);
        count++;
    }

    assertEquals(count, 1);

    count = 0;

    for (const n of random.iter(100).int(0, 2)) {
        assert(0 <= n && n <= 2);
        count++;
    }

    assertEquals(count, 100);

    assertThrows(() => random.iter(1).int(0, 0x1_0000_0000).next());
    assertThrows(() => random.iter(1).int(0, -1).next());

    assertThrows(() => random.iter(1).int(0, 0.5).next());
    assertThrows(() => random.iter(1).int(0, Infinity).next());
    assertThrows(() => random.iter(1).int(0, -Infinity).next());
    assertThrows(() => random.iter(1).int(0, NaN).next());

    assertThrows(() => random.iter(1).int(0.5, 0).next());
    assertThrows(() => random.iter(1).int(Infinity, 0).next());
    assertThrows(() => random.iter(1).int(-Infinity, 0).next());
    assertThrows(() => random.iter(1).int(NaN, 0).next());

    assertThrows(() =>
        random.iter(1).int(0, Number.MAX_SAFE_INTEGER + 1).next()
    );
    assertThrows(() =>
        random.iter(1).int(0, Number.MIN_SAFE_INTEGER - 1).next()
    );
});

Deno.test(function testRandomFloat() {
    const random = new Random();

    assertEquals(random.float(0, 0), 0);

    for (let i = 0; i < 100; i++) {
        const n = random.float(0, 1);
        assert(0 <= n && n < 1);
    }
});

Deno.test(function testRandomIterFloat() {
    const random = new Random();

    let count;

    count = 0;

    for (const n of random.iter(1).float(0, 0)) {
        assertEquals(n, 0);
        count++;
    }

    assertEquals(count, 1);

    count = 0;

    for (const n of random.iter(100).float(0, 1)) {
        assert(0 <= n && n < 1);
        count++;
    }

    assertEquals(count, 100);
});

Deno.test(function testRandomPick() {
    const random = new Random();

    assertEquals(random.pick([]), undefined);
    assertEquals(random.pick([1]), 1);

    for (let i = 0; i < 100; i++) {
        const n = random.pick([1, 2, 3]);
        assert(1 <= n && n <= 3);
    }
});

Deno.test(function testRandomIterPick() {
    const random = new Random();

    let count;

    count = 0;

    for (const n of random.iter(1).pick([])) {
        assertEquals(n, undefined);
        count++;
    }

    assertEquals(count, 1);

    count = 0;

    for (const n of random.iter(1).pick([1])) {
        assertEquals(n, 1);
        count++;
    }

    assertEquals(count, 1);

    count = 0;

    for (const n of random.iter(100).pick([1, 2, 3])) {
        assert(1 <= n && n <= 3);
        count++;
    }

    assertEquals(count, 100);
});

Deno.test(function testRandomString() {
    const random = new Random();

    assertEquals(random.string(0, ""), "");
    assertEquals(random.string(1, ""), "");

    assertEquals(random.string(0, "a"), "");

    for (let i = 0; i < 100; i++) {
        const s = random.string(3, "a");
        assertEquals(s, "aaa");
    }
});

Deno.test(function testRandomArray() {
    const random = new Random();

    assertEquals(random.array([], 0), []);
    assertEquals(random.array([], 1), [undefined]);

    assertEquals(random.array([1], 0), []);
    assertEquals(random.array([1], 1), [1]);

    for (let i = 0; i < 100; i++) {
        const a = random.array([1, 2, 3], 1);
        assert(!a.some((n) => n !== 1 && n !== 2 && n !== 3));
    }
});

Deno.test(function testRandomShuffle() {
    const random = new Random();

    assertEquals(random.shuffle([]), []);
    assertEquals(random.shuffle([1]), [1]);

    for (let i = 0; i < 100; i++) {
        const a = random.shuffle([1, 2, 3]);

        assertEquals(a.length, 3);

        const p1 = a[0] === 1 &&
            ((a[1] === 2 && a[2] === 3) ||
                (a[1] === 3 && a[2] === 2));
        const p2 = a[0] === 2 &&
            ((a[1] === 1 && a[2] === 3) ||
                (a[1] === 3 && a[2] === 1));

        const p3 = a[0] === 3 &&
            ((a[1] === 1 && a[2] === 2) ||
                (a[1] === 2 && a[2] === 1));

        assert(
            p1 || p2 || p3,
        );
    }
});

Deno.test(function testRandomShuffled() {
    const random = new Random();

    assertEquals(random.shuffled([]), []);
    assertEquals(random.shuffled([1]), [1]);

    for (let i = 0; i < 100; i++) {
        const a = random.shuffled([1, 2, 3]);

        assertEquals(a.length, 3);

        assert(
            (a[0] === 1 &&
                ((a[1] === 2 && a[2] === 3) ||
                    (a[1] === 3 && a[2] === 2))) ||
                (a[0] === 2 &&
                    ((a[1] === 1 && a[2] === 3) ||
                        (a[1] === 3 && a[2] === 1))) ||
                (a[0] === 3 &&
                    ((a[1] === 1 && a[2] === 2) ||
                        (a[1] === 2 && a[2] === 1))),
        );
    }
});

Deno.test(function testRandomSample() {
    const random = new Random();

    assertEquals(random.sample([], 0), []);
    assertEquals(random.sample([], 1), [undefined]);

    assertEquals(random.sample([1], 0), []);
    assertEquals(random.sample([1], 1), [1]);

    for (let i = 0; i < 100; i++) {
        const a = random.sample([1, 2, 3], 2);

        assertEquals(a.length, 2);

        assert(
            (a[0] === 1 && (a[1] === 2 || a[1] === 3)) ||
                (a[0] === 2 && (a[1] === 1 || a[1] === 3)) ||
                (a[0] === 3 && (a[1] === 1 || a[1] === 2)),
        );
    }

    assertEquals(random.sample([], 0), []);
    assertEquals(random.sample([], 1), [undefined]);
    assertEquals(random.sample([], 2), [undefined, undefined]);

    assertEquals(random.sample([1], 0), []);
    assertEquals(random.sample([1], 1), [1]);
    assertEquals(random.sample([1], 2), [1, 1]);

    const clone = random.clone();

    assertEquals(random.sample([1, 2, 3], 3), clone.shuffle([1, 2, 3]));
});

Deno.test(function testRandomState() {
    const random = new Random(xoshiro128(0));
    const state = random.save();
    const value = random.random();

    random.restore(state);
    assertEquals(random.random(), value);

    random.reset();
    assertEquals(random.random(), value);

    random.reset(0);
    assertEquals(random.random(), value);

    const clone = random.clone();
    assertEquals(random.random(), clone.random());
});
