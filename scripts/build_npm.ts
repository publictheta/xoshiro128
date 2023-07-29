import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

const version = Deno.args[0];

if (!version) {
    throw new Error("Version is required");
}

if (!version.match(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/)) {
    throw new Error("Invalid version");
}

await emptyDir("./dist/npm");

await build({
    entryPoints: ["./mod.ts", {
        name: "./random",
        path: "./random.ts",
    }],
    outDir: "./dist/npm",
    package: {
        name: "xoshiro128",
        version,
        description:
            "A fast, seedable, non-cryptographic random number generator.",
        keywords: ["random", "seed", "rng", "prng", "xoshiro", "xoshiro128"],
        license: "(MIT OR Apache-2.0)",
        repository: {
            type: "git",
            url: "git+https://github.com/publictheta/xoshiro128.git",
        },
    },
    importMap: "deno.jsonc",
    shims: {
        deno: {
            test: "dev",
        },
    },
    compilerOptions: {
        lib: ["ESNext", "DOM"],
    },
});

await Deno.copyFile("LICENSE-APACHE", "./dist/npm/LICENSE-APACHE");
await Deno.copyFile("LICENSE-MIT", "./dist/npm/LICENSE-MIT");
await Deno.copyFile("README.md", "./dist/npm/README.md");
