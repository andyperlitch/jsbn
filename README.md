# jsbn: javascript big number

[Tom Wu's Original Website](http://www-cs-students.stanford.edu/~tjw/jsbn/)

A fast, portable implementation of large-number math in pure JavaScript (Tom Wu's original jsbn and jsbn2), packaged for Node, browsers, and other modern JS runtimes.

This is not a constant-time cryptographic library. See [Security](#security).

## Demo

Live demo and in-browser benchmark (jsbn vs [bn.js](https://www.npmjs.com/package/bn.js), [big-integer](https://www.npmjs.com/package/big-integer), and [bignumber.js](https://www.npmjs.com/package/bignumber.js)):

**https://andyperlitch.github.io/jsbn/**

## Install

```bash
npm install jsbn
```

Bundled TypeScript types are included. You do not need `@types/jsbn`.

## Usage

```js
import { BigInteger, SecureRandom } from 'jsbn';
// or: const { BigInteger, SecureRandom } = require('jsbn');
// or: import BigInteger from 'jsbn';

const bi = new BigInteger('91823918239182398123');
console.log(bi.bitLength()); // 67
```

Script tag (IIFE build):

```html
<script src="jsbn.global.js"></script>
<script>
  const bi = new jsbn.BigInteger('91823918239182398123');
</script>
```

Arithmetic methods take **BigInteger** arguments, not JavaScript numbers:

```js
n.divide(new BigInteger('2')); // correct
n.divide(2); // TypeError
```

## Constructor

`new BigInteger(value)`

| Call                                        | Meaning                                                       |
| ------------------------------------------- | ------------------------------------------------------------- |
| `new BigInteger(string)`                    | Decimal string, or `0x` / `0b` / `0o` prefixed                |
| `new BigInteger(string, radix)`             | String in radix 2–36                                          |
| `new BigInteger(byteArray)`                 | Big-endian signed byte array (same format as `toByteArray()`) |
| `new BigInteger(bitLength, rng)`            | Random integer of `bitLength` bits                            |
| `new BigInteger(bitLength, certainty, rng)` | Random probable prime                                         |

```js
new BigInteger('255');
new BigInteger('ff', 16);
new BigInteger('0xff');
new BigInteger([0x01, 0x00]); // 256
```

`toByteArray()` round-trips:

```js
const n = new BigInteger('91823918239182398123');
n.equals(new BigInteger(n.toByteArray())); // true
```

## Statics

### `BigInteger.ZERO`

The integer 0.

### `BigInteger.ONE`

The integer 1.

## Instance methods

### `bi.toString([radix]) => string`

String representation. `radix` is 2–36; default 10.

### `bi.negate() => BigInteger`

Negation of `bi`.

### `bi.abs() => BigInteger`

Absolute value. Returns `bi` itself when already non-negative.

### `bi.compareTo(other) => number`

Negative if `bi < other`, positive if `bi > other`, `0` if equal.

### `bi.bitLength() => number`

Number of bits in the two's-complement representation, excluding the sign bit.

### `bi.mod(m) => BigInteger`

`bi` modulo `m` (non-negative remainder).

### `bi.modPow(exponent, m) => BigInteger`

`bi`<sup>`exponent`</sup> mod `m`. `exponent` and `m` are BigIntegers.

### `bi.modPowInt(e, m) => BigInteger`

`bi`<sup>`e`</sup> mod `m` for a JS number exponent `0 <= e < 2^32`.

### `bi.clone() => BigInteger`

Independent copy.

### `bi.intValue() => number`

Low bits as a JS integer.

### `bi.byteValue() => number`

Value as a signed byte.

### `bi.shortValue() => number`

Value as a signed 16-bit integer.

### `bi.signum() => number`

`-1`, `0`, or `1`.

### `bi.toByteArray() => number[]`

Big-endian two's-complement byte array. Pass it back to `new BigInteger(bytes)` to round-trip.

### `bi.equals(other) => boolean`

Same integer value as `other`.

### `bi.min(other) => BigInteger`

The smaller of `bi` and `other`.

### `bi.max(other) => BigInteger`

The larger of `bi` and `other`.

### `bi.and(other) => BigInteger`

Bitwise AND.

### `bi.or(other) => BigInteger`

Bitwise OR.

### `bi.xor(other) => BigInteger`

Bitwise XOR.

### `bi.andNot(other) => BigInteger`

Bitwise AND with the complement of `other`.

### `bi.not() => BigInteger`

Bitwise NOT.

### `bi.shiftLeft(n) => BigInteger`

Left shift by `n` bits (`n` may be negative).

### `bi.shiftRight(n) => BigInteger`

Right shift by `n` bits (`n` may be negative).

### `bi.getLowestSetBit() => number`

Index of the lowest set bit, or `-1` if none.

### `bi.bitCount() => number`

Number of bits differing from the sign bit (Hamming weight of the two's-complement form).

### `bi.testBit(n) => boolean`

Whether bit `n` is set.

### `bi.setBit(n) => BigInteger`

Copy with bit `n` set.

### `bi.clearBit(n) => BigInteger`

Copy with bit `n` cleared.

### `bi.flipBit(n) => BigInteger`

Copy with bit `n` flipped.

### `bi.add(other) => BigInteger`

`bi + other`.

### `bi.subtract(other) => BigInteger`

`bi - other`.

### `bi.multiply(other) => BigInteger`

`bi * other`.

### `bi.square() => BigInteger`

`bi * bi`.

### `bi.divide(other) => BigInteger`

Integer quotient `bi / other`. `other` must be a BigInteger.

### `bi.remainder(other) => BigInteger`

Remainder of `bi / other`.

### `bi.divideAndRemainder(other) => [BigInteger, BigInteger]`

`[quotient, remainder]`.

### `bi.modInverse(m) => BigInteger`

Modular inverse of `bi` modulo `m`, or `ZERO` if it does not exist. Negative `bi` is reduced modulo `m` first.

### `bi.pow(e) => BigInteger`

`bi`<sup>`e`</sup> for a JS number exponent.

### `bi.gcd(other) => BigInteger`

Greatest common divisor.

### `bi.isProbablePrime(t) => boolean`

Miller–Rabin primality test with certainty `>= 1 - 0.5^t`.

## SecureRandom

```js
const rng = new SecureRandom();
const bytes = [];
bytes.length = 32;
rng.nextBytes(bytes);
```

### `rng.nextBytes(bytes) => void`

Fills `bytes` (an array or `Uint8Array`) from `globalThis.crypto.getRandomValues` (browsers, workers, Node 19+), or from `node:crypto` in CommonJS. If neither is available, fills with `Math.random()` and prints a one-time warning. That fallback is **not** a CSPRNG; do not use it for keys or tokens.

## Internal / protected API

Dependents such as node-forge use methods that Tom Wu marked `(protected)`. They remain on the prototype and are not going away:

`copyTo`, `fromInt`, `fromString`, `fromRadix`, `fromNumber`, `clamp`, `dlShiftTo`, `drShiftTo`, `lShiftTo`, `rShiftTo`, `subTo`, `multiplyTo`, `squareTo`, `divRemTo`, `invDigit`, `isEven`, `exp`, `chunkSize`, `toRadix`, `bitwiseTo`, `changeBit`, `addTo`, `dMultiply`, `dAddOffset`, `multiplyLowerTo`, `multiplyUpperTo`, `modInt`, `millerRabin`, `am`, `DB`, `DM`, `DV`, `FV`, `F1`, `F2`, and `Barrett`.

Digit limbs live on the instance itself (`bi[i]`, plus `t` and `s`).

## Security

jsbn is a general-purpose big-integer library. Modular exponentiation, inversion, and comparison are **not constant-time** and can leak information through timing. Do not use it to implement new cryptography.

`SecureRandom` is provided for existing callers. New code should use `globalThis.crypto` directly.

See [SECURITY.md](SECURITY.md).

## License

Tom Wu's original MIT-style license. See [LICENSE](LICENSE).
