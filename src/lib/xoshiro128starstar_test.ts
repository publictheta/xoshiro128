import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { Xoshiro128StarStar } from "./xoshiro128starstar.ts";
import { assertNotEquals } from "https://deno.land/std/assert/assert_not_equals.ts";
import { seedState } from "./xoshiro128.ts";
import { assertThrows } from "https://deno.land/std/assert/assert_throws.ts";

Deno.test(function testXoshiro128StarStar() {
    const xoshiro = new Xoshiro128StarStar([0, 1, 2, 3]);

    const expected: number[] = [
        5760,
        17280,
        2966400,
        32451840,
        2604340873,
        3891234569,
        1254043636,
        216095511,
        3291724652,
        2070429911,
        3403762308,
        371730125,
        2871333640,
        1107719891,
        407174912,
        2984142590,
        3931454317,
        988064505,
        139866493,
        1642526786,
        2209862179,
        1349487243,
        1285712680,
        615038681,
        3943957616,
        1212430137,
        2007351553,
        492343048,
        3280648624,
        35038342,
    ];

    const actual = new Array(expected.length);

    for (let i = 0; i < expected.length; i++) {
        actual[i] = xoshiro.next();
    }

    assertEquals(actual, expected);
});

Deno.test(function testXoshiro128StarStarJump() {
    const xoshiro = new Xoshiro128StarStar([0, 1, 2, 3]);

    const expected: [number, number, number, number][] = [
        [1420208605, 2756366498, 3183403541, 355651687],
        [128089391, 1127588374, 1162191529, 3055069593],
        [1828887832, 3318894257, 906323697, 2906362979],
        [3308690282, 2779949863, 2517686995, 3093479076],
        [1621233272, 2535361041, 2368630924, 3725314812],
        [3880097633, 4012513117, 66659682, 2982746873],
        [520134404, 3389056075, 2377638964, 3474344234],
        [3213339590, 1612398583, 104382070, 3758711936],
        [1518529056, 1681549308, 905399485, 2193080482],
        [1956656061, 2601587239, 799838801, 979231801],
    ];

    const actual = new Array(expected.length);

    for (let i = 0; i < expected.length; i++) {
        xoshiro.jump();
        actual[i] = xoshiro.save();
    }

    assertEquals(actual, expected);
});

Deno.test(function testXoshiro128StarStarLongJump() {
    const xoshiro = new Xoshiro128StarStar([0, 1, 2, 3]);

    const expected: [number, number, number, number][] = [
        [3538829081, 3912042811, 2257374149, 2462051210],
        [716448362, 3740946539, 1383159140, 2775267837],
        [220087354, 941898060, 1708240616, 744403140],
        [2098041730, 3835974295, 1033819444, 2767370361],
        [61858829, 1946679072, 3125742427, 2215791613],
        [3457117903, 2199962417, 2912200556, 3962007922],
        [2500040063, 2263130783, 31426141, 911469324],
        [3512015494, 3412876216, 3211938396, 1071975977],
        [2936108203, 355912565, 1014301220, 1160790439],
        [1108021585, 1433609122, 3395341620, 2316553222],
    ];

    const actual = new Array(expected.length);

    for (let i = 0; i < expected.length; i++) {
        xoshiro.longJump();
        actual[i] = xoshiro.save();
    }

    assertEquals(actual, expected);
});

Deno.test(function testXoshiro128StarStarState() {
    const seed = 1234;
    const name = "hello";
    const xoshiro = new Xoshiro128StarStar(seedState(seed), seed, name);

    assertEquals(xoshiro.seed, seed);
    assertEquals(xoshiro.name, name);

    const state = xoshiro.save();

    const clone = xoshiro.clone();
    assertEquals(clone.seed, seed);
    assertEquals(clone.name, name);
    assertEquals(clone.save(), state);

    const value = xoshiro.random();
    assertNotEquals(xoshiro.save(), state);

    xoshiro.restore(state);
    assertEquals(xoshiro.save(), state);
    assertEquals(xoshiro.random(), value);

    xoshiro.reset();
    assertEquals(xoshiro.save(), state);
    assertEquals(xoshiro.random(), value);

    const xoshiro2 = new Xoshiro128StarStar([1, 2, 3, 4], [1, 2, 3, 4]);
    assertEquals(xoshiro2.seed, undefined);
    assertEquals(xoshiro2.name, undefined);

    xoshiro2.random();
    assertNotEquals(xoshiro2.save(), [1, 2, 3, 4]);

    xoshiro2.reset();
    assertEquals(xoshiro2.save(), [1, 2, 3, 4]);

    const xoshiro3 = new Xoshiro128StarStar([1, 2, 3, 4]);
    assertEquals(xoshiro3.seed, undefined);
    assertEquals(xoshiro3.name, undefined);

    xoshiro3.random();
    assertNotEquals(xoshiro3.save(), [1, 2, 3, 4]);

    assertThrows(() => xoshiro3.reset());
});
