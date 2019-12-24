import { BigInteger } from '.';
describe('jsbn', () => {
  describe('constructor', () => {
    it('accepts a decimal number as a string', () => {
      const bi = new BigInteger('12345');
      expect(bi.toString()).toEqual('12345');
    });
    it('accepts ');
  });
  describe('bi.bitLength', () => {
    it('returns the bit length', () => {
      const bi = new BigInteger('91823918239182398123');
      expect(bi.bitLength()).toEqual(67);
    });
  });
  describe('bi.toString', () => {
    it('returns a string representation of the integer', () => {
      const numString = '91823918239182398123';
      const bi = new BigInteger(numString);
      expect(bi.toString()).toEqual(numString);
    });
  });
  describe('bi.negate', () => {});
  describe('bi.abs', () => {});
  describe('bi.compareTo', () => {});
  describe('bi.bitLength', () => {});
  describe('bi.mod', () => {});
  describe('bi.modPow', () => {});
  describe('bi.modPowInt', () => {});
  describe('bi.clone', () => {});
  describe('bi.intValue', () => {});
  describe('bi.byteValue', () => {});
  describe('bi.shortValue', () => {});
  describe('bi.signum', () => {});
  describe('bi.toByteArray', () => {});
  describe('bi.equals', () => {});
  describe('bi.min', () => {});
  describe('bi.max', () => {});
  describe('bi.and', () => {});
  describe('bi.or', () => {});
  describe('bi.xor', () => {});
  describe('bi.andNot', () => {});
  describe('bi.not', () => {});
  describe('bi.shiftLeft', () => {});
  describe('bi.shiftRight', () => {});
  describe('bi.getLowestSetBit', () => {});
  describe('bi.bitCount', () => {});
  describe('bi.testBit', () => {});
  describe('bi.setBit', () => {});
  describe('bi.clearBit', () => {});
  describe('bi.flipBit', () => {});
  describe('bi.add', () => {});
  describe('bi.subtract', () => {});
  describe('bi.multiply', () => {});
  describe('bi.divide', () => {});
  describe('bi.remainder', () => {});
  describe('bi.divideAndRemainder', () => {});
  describe('bi.modPow', () => {});
  describe('bi.modInverse', () => {});
  describe('bi.pow', () => {});
  describe('bi.gcd', () => {});
  describe('bi.isProbablePrime', () => {});
});
