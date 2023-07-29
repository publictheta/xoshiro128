import {
    assert,
    assertEquals,
    assertNotEquals,
    assertThrows,
} from "https://deno.land/std/assert/mod.ts";
import { xoshiro128 } from "./xoshiro128.ts";
import { Kind, State } from "./lib/xoshiro128.ts";

Deno.test(function testXoshiro128Random() {
    const rng = xoshiro128(1234);

    assertEquals(rng.random(), 0.4488106195349246);
    assertEquals(rng.random(), 0.6467702996451408);
    assertEquals(rng.random(), 0.3171623020898551);
});

Deno.test(function testXoshiro128Next() {
    const rng = xoshiro128(1234);

    assertEquals(rng.next(), 1927626933);
    assertEquals(rng.next(), 2777857285);
    assertEquals(rng.next(), 1362201715);
});

Deno.test(function testXoshiro128Hash() {
    assertEquals(xoshiro128("hello").seed, 3619887497);
    assertEquals(xoshiro128("世界").seed, 1428577284);
    assertEquals(xoshiro128("🌍").seed, 3908689134);

    assertEquals(xoshiro128("hello").name, "hello");
    assertEquals(xoshiro128("世界").name, "世界");
    assertEquals(xoshiro128("🌍").name, "🌍");

    assertEquals(xoshiro128({ name: "hello" }).seed, 3619887497);
    assertEquals(xoshiro128({ name: "世界" }).seed, 1428577284);
    assertEquals(xoshiro128({ name: "🌍" }).seed, 3908689134);

    assertEquals(xoshiro128({ name: "hello" }).name, "hello");
    assertEquals(xoshiro128({ name: "世界" }).name, "世界");
    assertEquals(xoshiro128({ name: "🌍" }).name, "🌍");
});

Deno.test(function testXoshiro128Seed() {
    assertEquals(xoshiro128().seed, 0);
    assertEquals(xoshiro128(1234).seed, 1234);

    assertEquals(xoshiro128({}).seed, 0);
    assertEquals(xoshiro128({ seed: 1234 }).seed, 1234);

    assertThrows(() => xoshiro128(-1));
    assertThrows(() => xoshiro128(0x100000000));
    assertThrows(() => xoshiro128(0.5));
    assertThrows(() => xoshiro128(NaN));
    assertThrows(() => xoshiro128(Infinity));
    assertThrows(() => xoshiro128(-Infinity));

    assertThrows(() => xoshiro128({ seed: -1 }));
    assertThrows(() => xoshiro128({ seed: 0x100000000 }));
    assertThrows(() => xoshiro128({ seed: 0.5 }));
    assertThrows(() => xoshiro128({ seed: NaN }));
    assertThrows(() => xoshiro128({ seed: Infinity }));
    assertThrows(() => xoshiro128({ seed: -Infinity }));
});

Deno.test(function testXoshiro128RandomSeed() {
    assert(xoshiro128({ random: true }).seed !== undefined);

    assert(xoshiro128({ random: false as true }).seed === 0);
});

Deno.test(function testXoshiro128State() {
    let rng;

    rng = xoshiro128([1, 2, 3, 4]);

    assertEquals(rng.save(), [1, 2, 3, 4]);
    assertEquals(rng.seed, undefined);
    assertEquals(rng.name, undefined);

    rng = xoshiro128({ state: [1, 2, 3, 4] });

    assertEquals(rng.save(), [1, 2, 3, 4]);
    assertEquals(rng.seed, undefined);
    assertEquals(rng.name, undefined);

    rng = xoshiro128({ state: [1, 2, 3, 4], seed: 1234 });

    assertEquals(rng.seed, 1234);
    assertEquals(rng.name, undefined);

    rng = xoshiro128({ state: [1, 2, 3, 4], name: "hello" });

    assertEquals(rng.seed, undefined);
    assertEquals(rng.name, "hello");

    rng = xoshiro128({ state: [1, 2, 3, 4], seed: 1234, name: "hello" });

    assertEquals(rng.seed, 1234);
    assertEquals(rng.name, "hello");

    rng = xoshiro128({ state: [0, 0, 0, 0] });

    assertNotEquals(rng.save(), [0, 0, 0, 0]);

    assertThrows(() => xoshiro128([-1, 0, 0, 0]));
    assertThrows(() => xoshiro128([0x100000000, 0, 0, 0]));
    assertThrows(() => xoshiro128([0.5, 0, 0, 0]));
    assertThrows(() => xoshiro128([NaN, 0, 0, 0]));
    assertThrows(() => xoshiro128([Infinity, 0, 0, 0]));
    assertThrows(() => xoshiro128([-Infinity, 0, 0, 0]));
    assertThrows(() => xoshiro128([] as unknown as State));

    assertThrows(() => xoshiro128({ state: [-1, 0, 0, 0] }));
    assertThrows(() => xoshiro128({ state: [0x100000000, 0, 0, 0] }));
    assertThrows(() => xoshiro128({ state: [0.5, 0, 0, 0] }));
    assertThrows(() => xoshiro128({ state: [NaN, 0, 0, 0] }));
    assertThrows(() => xoshiro128({ state: [Infinity, 0, 0, 0] }));
    assertThrows(() => xoshiro128({ state: [-Infinity, 0, 0, 0] }));
    assertThrows(() => xoshiro128({ state: [] as unknown as State }));
});

Deno.test(function testXoshiro128Kind() {
    assertEquals(Kind.Plus, "xoshiro128plus");
    assertEquals(Kind.PlusPlus, "xoshiro128plusplus");
    assertEquals(Kind.StarStar, "xoshiro128starstar");

    const DEFAULT = Kind.StarStar;

    assertEquals(xoshiro128().kind, DEFAULT);
    assertEquals(xoshiro128(1234).kind, DEFAULT);
    assertEquals(xoshiro128("hello").kind, DEFAULT);
    assertEquals(xoshiro128([1, 2, 3, 4]).kind, DEFAULT);

    assertEquals(xoshiro128({}).kind, DEFAULT);
    assertEquals(xoshiro128({ seed: 1234 }).kind, DEFAULT);
    assertEquals(xoshiro128({ name: "hello" }).kind, DEFAULT);
    assertEquals(xoshiro128({ random: true }).kind, DEFAULT);
    assertEquals(xoshiro128({ state: [1, 2, 3, 4] }).kind, DEFAULT);

    assertEquals(xoshiro128(undefined, Kind.Plus).kind, Kind.Plus);
    assertEquals(xoshiro128(1234, Kind.Plus).kind, Kind.Plus);
    assertEquals(xoshiro128("hello", Kind.Plus).kind, Kind.Plus);
    assertEquals(xoshiro128([1, 2, 3, 4], Kind.Plus).kind, Kind.Plus);

    assertEquals(xoshiro128({}, Kind.Plus).kind, Kind.Plus);
    assertEquals(xoshiro128({ seed: 1234 }, Kind.Plus).kind, Kind.Plus);
    assertEquals(xoshiro128({ name: "hello" }, Kind.Plus).kind, Kind.Plus);
    assertEquals(xoshiro128({ random: true }, Kind.Plus).kind, Kind.Plus);
    assertEquals(
        xoshiro128({ state: [1, 2, 3, 4] }, Kind.Plus).kind,
        Kind.Plus,
    );

    assertEquals(
        xoshiro128({ seed: 1234, kind: Kind.Plus }).kind,
        Kind.Plus,
    );
    assertEquals(
        xoshiro128({ name: "hello", kind: Kind.Plus }).kind,
        Kind.Plus,
    );
    assertEquals(
        xoshiro128({ random: true, kind: Kind.Plus }).kind,
        Kind.Plus,
    );
    assertEquals(
        xoshiro128({ state: [1, 2, 3, 4], kind: Kind.Plus }).kind,
        Kind.Plus,
    );

    assertEquals(
        xoshiro128({ seed: 1234, kind: Kind.PlusPlus }, Kind.Plus).kind,
        Kind.Plus,
    );
    assertEquals(
        xoshiro128({ name: "hello", kind: Kind.PlusPlus }, Kind.Plus).kind,
        Kind.Plus,
    );
    assertEquals(
        xoshiro128({ random: true, kind: Kind.PlusPlus }, Kind.Plus).kind,
        Kind.Plus,
    );
    assertEquals(
        xoshiro128({ state: [1, 2, 3, 4], kind: Kind.PlusPlus }, Kind.Plus)
            .kind,
        Kind.Plus,
    );

    assertEquals(xoshiro128({ kind: Kind.Plus }).kind, Kind.Plus);
    assertEquals(xoshiro128({ kind: Kind.PlusPlus }).kind, Kind.PlusPlus);
    assertEquals(xoshiro128({ kind: Kind.StarStar }).kind, Kind.StarStar);

    assertEquals(
        xoshiro128({ kind: Kind.PlusPlus }, Kind.Plus).kind,
        Kind.Plus,
    );
    assertEquals(
        xoshiro128({ kind: Kind.Plus }, Kind.PlusPlus).kind,
        Kind.PlusPlus,
    );
    assertEquals(
        xoshiro128({ kind: Kind.Plus }, Kind.StarStar).kind,
        Kind.StarStar,
    );
    assertThrows(() => xoshiro128({ kind: "invalid" as Kind }));
});
