# jsbn: javascript big number

[Tom Wu's Original Website](http://www-cs-students.stanford.edu/~tjw/jsbn/)

I felt compelled to put this on github and publish to npm. I haven't tested every other big integer library out there, but the few that I have tested in comparison to this one have not even come close in performance. I am aware of the `bi` module on npm, however it has been modified and I wanted to publish the original without modifications. This is jsbn and jsbn2 from Tom Wu's original website above, with the module pattern applied to prevent global leaks and to allow for use with node.js on the server side.

## Usage

```js
var BigInteger = require('jsbn').BigInteger;

var bi = new BigInteger('91823918239182398123');
console.log(bi.bitLength()); // 67
```

## API

### `bi.toString([radix]) => string`

Returns a string representing the BigInteger `bi`.

+ `radix` - Optional. An integer between 2 and 36 specifying the base to use for representing numeric values.

If the `radix` is not specified, the preferred `radix` is assumed to be 10.

### `bi.negate() => BigInteger`

Returns a new `BigInteger` equal to the negation of `bi`.

### `bi.abs() => BigInteger`

Returns a `BigInteger` equal to the absolute value of `bi`.

*note: if the `bi` is a positive value, it will be returned as is, otherwise a new instance of `BigInteger` is returned.*

### `bi.compareTo(other) => number`

Compare to `BigInteger`s. The return value will be a negative JavaScript number if `bi` is less than `other`, a positive number if `bi` is greater than `other`, and `0` if `bi` and `other` represents the same integer.

### `bi.bitLength() => number`

Returns the number of bits used to store `bi` as a JavaScript number.

### `bi.mod(m) => BigInteger`

Returns a `BigInteger` with the value of (`bi` mod `m`).

### `bi.modPow(exponent, m) => BitInteger`

Returns a `BigInteger` with the value of (`bi`<sup>`exponent`</sup> mod `m`).

### bi.modPowInt



### bi.clone



### bi.intValue



### bi.byteValue



### bi.shortValue



### bi.signum



### bi.toByteArray



### bi.equals



### bi.min



### bi.max



### bi.and



### bi.or



### bi.xor



### bi.andNot



### bi.not



### bi.shiftLeft



### bi.shiftRight



### bi.getLowestSetBit



### bi.bitCount



### bi.testBit



### bi.setBit



### bi.clearBit



### bi.flipBit



### bi.add



### bi.subtract



### bi.multiply



### bi.divide



### bi.remainder



### bi.divideAndRemainder



### bi.modPow



### bi.modInverse



### bi.pow



### bi.gcd



### bi.isProbablePrime
