import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { hash } from "./murmur3.ts";

const X86_32_UTF8_0: [string, number][] = [
    ["", 0],
    ["hello", 613153351],
    ["hello, world", 345750399],
    ["hello, world!", 3967868818],
    ["1", 2484513939],
    ["2", 19522071],
    ["3", 264741300],
    ["4", 3778137224],
    ["5", 1394226660],
    ["6", 670727360],
    ["7", 602572328],
    ["8", 3180462103],
    ["9", 613148321],
    ["0", 3530670207],
    ["00", 2415375917],
    ["000", 2315809666],
    ["0000", 2542535588],
    ["00000", 1570519097],
    ["000000", 3115121060],
    ["0000000", 1166849212],
    ["00000000", 2565335819],
    ["000000000", 248027990],
    ["0000000000", 3521760859],
    ["00000000000", 2154338162],
    ["000000000000", 721264336],
    ["0000000000000", 2874926510],
    ["00000000000000", 2506303739],
    ["000000000000000", 3988792475],
    ["0000000000000000", 311772644],
    ["00000000000000000", 3315956656],
    ["000000000000000000", 878735217],
    ["0000000000000000000", 2138682033],
];

const encoder = new TextEncoder();

Deno.test(function testMurmur3Hash32() {
    const actual = new Array(X86_32_UTF8_0.length);

    for (let i = 0; i < X86_32_UTF8_0.length; i++) {
        const input = X86_32_UTF8_0[i][0];

        const utf8 = encoder.encode(input);
        const view = new DataView(utf8.buffer);

        let pos = 0;

        actual[i] = [
            input,
            hash(utf8.byteLength, () => {
                const result = view.getUint32(pos, true);

                pos += 4;

                return result;
            }, () => {
                return utf8.subarray(pos);
            }, 0),
        ];
    }

    assertEquals(actual, X86_32_UTF8_0);
});
