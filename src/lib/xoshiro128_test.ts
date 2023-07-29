import {
    assertEquals,
    assertNotEquals,
    assertThrows,
} from "https://deno.land/std/assert/mod.ts";
import {
    jump,
    longJump,
    sanitizeState,
    State,
    validateState,
    validateStateNonZero,
} from "./xoshiro128.ts";

Deno.test(function testXoshiro128Jump() {
    const state: State = [0, 1, 2, 3];

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
        jump(state);
        actual[i] = state.slice();
    }

    assertEquals(actual, expected);
});

Deno.test(function testXoshiro128LongJump() {
    const state: State = [0, 1, 2, 3];

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
        longJump(state);
        actual[i] = state.slice();
    }

    assertEquals(actual, expected);
});

Deno.test(function testValidateStateNonZero() {
    validateStateNonZero([1, 2, 3, 4]);

    assertThrows(() => validateStateNonZero([0, 0, 0, 0]));
});

Deno.test(function testValidateState() {
    validateState([1, 2, 3, 4]);

    assertThrows(() => validateState([0, 0, 0, 0]));
    assertThrows(() => validateState([0x100000000, 0, 0, 0]));
    assertThrows(() => validateState([-1, 0, 0, 0]));
    assertThrows(() => validateState([0.5, 0, 0, 0]));
    assertThrows(() => validateState([NaN, 0, 0, 0]));
    assertThrows(() => validateState([Infinity, 0, 0, 0]));
    assertThrows(() => validateState([-Infinity, 0, 0, 0]));
});

Deno.test(function testSanitizeState() {
    assertEquals(sanitizeState([1, 2, 3, 4]), [1, 2, 3, 4]);
    assertNotEquals(sanitizeState([0, 0, 0, 0]), [0, 0, 0, 0]);
    assertThrows(() => sanitizeState([0x100000000, 0, 0, 0]));
    assertThrows(() => sanitizeState([-1, 0, 0, 0]));
    assertThrows(() => sanitizeState([0.5, 0, 0, 0]));
    assertThrows(() => sanitizeState([NaN, 0, 0, 0]));
    assertThrows(() => sanitizeState([Infinity, 0, 0, 0]));
    assertThrows(() => sanitizeState([-Infinity, 0, 0, 0]));
});
