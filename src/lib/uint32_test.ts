import { assertThrows } from "https://deno.land/std/assert/mod.ts";
import { validate32 } from "./uint32.ts";

Deno.test(function testValidate32() {
    validate32(0, "0");
    validate32(0xffffffff - 1, "0xffffffff - 1");

    assertThrows(() => validate32(-1, "-1"));
    assertThrows(() => validate32(0xfffffffff, "0xfffffffff"));

    assertThrows(() => validate32(0.5, "0.5"));
    assertThrows(() => validate32(NaN, "NaN"));
    assertThrows(() => validate32(Infinity, "Infinity"));
    assertThrows(() => validate32(-Infinity, "-Infinity"));
});
