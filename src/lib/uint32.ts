export function validate32(n: number, name: string) {
    if (!Number.isInteger(n)) {
        throw new RangeError(`${name} must be an integer: ${n}`);
    }

    if (n < 0) {
        throw new RangeError(`${name} must be non-negative: ${n}`);
    }

    if (n > 0xffffffff) {
        throw new RangeError(`${name} must be less than 2^32: ${n}`);
    }
}
