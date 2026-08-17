import { afterEach, describe, expect, it, vi } from 'vitest';
import BigInteger, {
  BigInteger as NamedBigInteger,
  SecureRandom,
} from '../src/index.ts';

function bi(value: string | number, radix?: number) {
  return new NamedBigInteger(String(value), radix);
}

describe('exports', () => {
  it('provides named BigInteger and SecureRandom plus a default export', () => {
    expect(NamedBigInteger).toBe(BigInteger);
    expect(typeof SecureRandom).toBe('function');
    expect(BigInteger.ZERO.toString()).toBe('0');
    expect(BigInteger.ONE.toString()).toBe('1');
  });
});

describe('constructor', () => {
  it('parses a decimal string', () => {
    expect(new NamedBigInteger('91823918239182398123').toString()).toBe(
      '91823918239182398123'
    );
  });

  it('parses with an explicit radix', () => {
    expect(new NamedBigInteger('ff', 16).toString()).toBe('255');
    expect(new NamedBigInteger('1010', 2).toString()).toBe('10');
  });

  it('auto-detects 0x, 0b, and 0o prefixes', () => {
    expect(new NamedBigInteger('0xff').toString()).toBe('255');
    expect(new NamedBigInteger('0b1010').toString()).toBe('10');
    expect(new NamedBigInteger('0o17').toString()).toBe('15');
  });

  it('accepts a byte array (radix 256)', () => {
    const bytes = [0x01, 0x00];
    expect(new NamedBigInteger(bytes).toString()).toBe('256');
  });

  it('round-trips toByteArray', () => {
    const original = bi('91823918239182398123');
    const roundTrip = new NamedBigInteger(original.toByteArray());
    expect(roundTrip.equals(original)).toBe(true);
  });

  it('parses zero', () => {
    expect(new NamedBigInteger('0', 10).toString()).toBe('0');
    expect(new NamedBigInteger('0').signum()).toBe(0);
  });
});

describe('toString', () => {
  it('defaults to decimal', () => {
    expect(bi('255').toString()).toBe('255');
  });

  it('supports other radices', () => {
    expect(bi('255').toString(16)).toBe('ff');
    expect(bi('10').toString(2)).toBe('1010');
  });

  it('includes a minus sign for negatives', () => {
    expect(bi('-42').toString()).toBe('-42');
  });
});

describe('sign and comparison', () => {
  it('negate returns a new negated value', () => {
    const n = bi('42');
    expect(n.negate().toString()).toBe('-42');
    expect(n.toString()).toBe('42');
  });

  it('abs returns this when positive and a new instance when negative', () => {
    const pos = bi('7');
    expect(pos.abs()).toBe(pos);
    expect(bi('-7').abs().toString()).toBe('7');
  });

  it('compareTo / equals / min / max', () => {
    const a = bi('10');
    const b = bi('20');
    expect(a.compareTo(b) < 0).toBe(true);
    expect(b.compareTo(a) > 0).toBe(true);
    expect(a.compareTo(bi('10'))).toBe(0);
    expect(a.equals(bi('10'))).toBe(true);
    expect(a.equals(b)).toBe(false);
    expect(a.min(b).toString()).toBe('10');
    expect(a.max(b).toString()).toBe('20');
  });

  it('signum', () => {
    expect(bi('-1').signum()).toBe(-1);
    expect(bi('0').signum()).toBe(0);
    expect(bi('1').signum()).toBe(1);
  });
});

describe('bit operations', () => {
  it('bitLength matches the README example', () => {
    expect(bi('91823918239182398123').bitLength()).toBe(67);
  });

  it('shiftLeft / shiftRight', () => {
    expect(bi('1').shiftLeft(8).toString()).toBe('256');
    expect(bi('256').shiftRight(8).toString()).toBe('1');
  });

  it('and / or / xor / andNot / not', () => {
    const a = bi('12'); // 1100
    const b = bi('10'); // 1010
    expect(a.and(b).toString()).toBe('8');
    expect(a.or(b).toString()).toBe('14');
    expect(a.xor(b).toString()).toBe('6');
    expect(a.andNot(b).toString()).toBe('4');
    expect(bi('0').not().toString()).toBe('-1');
  });

  it('testBit / setBit / clearBit / flipBit', () => {
    const n = bi('0');
    expect(n.testBit(3)).toBe(false);
    const set = n.setBit(3);
    expect(set.toString()).toBe('8');
    expect(set.testBit(3)).toBe(true);
    expect(set.clearBit(3).toString()).toBe('0');
    expect(set.flipBit(3).toString()).toBe('0');
  });

  it('getLowestSetBit / bitCount', () => {
    expect(bi('8').getLowestSetBit()).toBe(3);
    expect(bi('0').getLowestSetBit()).toBe(-1);
    expect(bi('7').bitCount()).toBe(3);
  });
});

describe('arithmetic', () => {
  it('add / subtract / multiply / square', () => {
    expect(bi('10').add(bi('32')).toString()).toBe('42');
    expect(bi('50').subtract(bi('8')).toString()).toBe('42');
    expect(bi('6').multiply(bi('7')).toString()).toBe('42');
    expect(bi('7').square().toString()).toBe('49');
  });

  it('divide / remainder / divideAndRemainder', () => {
    const n = bi('100');
    const d = bi('7');
    expect(n.divide(d).toString()).toBe('14');
    expect(n.remainder(d).toString()).toBe('2');
    const [q, r] = n.divideAndRemainder(d);
    expect(q.toString()).toBe('14');
    expect(r.toString()).toBe('2');
  });

  it('throws when divide is given a JS number instead of a BigInteger', () => {
    expect(() => bi('8888888888888888').divide(2 as never)).toThrow();
  });

  it('pow', () => {
    expect(bi('2').pow(10).toString()).toBe('1024');
  });

  it('matches native BigInt for a sample of large values', () => {
    const a = 91823918239182398123n;
    const b = 42424242424242424243n;
    expect(bi(a.toString()).add(bi(b.toString())).toString()).toBe(
      (a + b).toString()
    );
    expect(bi(a.toString()).multiply(bi(b.toString())).toString()).toBe(
      (a * b).toString()
    );
    expect(bi(a.toString()).subtract(bi(b.toString())).toString()).toBe(
      (a - b).toString()
    );
    expect(bi(a.toString()).divide(bi(b.toString())).toString()).toBe(
      (a / b).toString()
    );
  });
});

describe('modular arithmetic', () => {
  it('mod / modPow / modPowInt', () => {
    expect(bi('17').mod(bi('5')).toString()).toBe('2');
    expect(bi('3').modPow(bi('5'), bi('7')).toString()).toBe('5'); // 243 % 7 = 5
    expect(bi('3').modPowInt(5, bi('7')).toString()).toBe('5');
  });

  it('modInverse', () => {
    expect(bi('3').modInverse(bi('11')).toString()).toBe('4');
  });

  it('modInverse on a negative number reduces instead of hanging', () => {
    expect(bi('-3').modInverse(bi('2')).toString()).toBe('1');
  });

  it('gcd', () => {
    expect(bi('1071').gcd(bi('462')).toString()).toBe('21');
  });
});

describe('conversion', () => {
  it('clone is independent of the original', () => {
    const n = bi('99');
    const c = n.clone();
    expect(c.equals(n)).toBe(true);
    expect(c).not.toBe(n);
  });

  it('intValue / byteValue / shortValue', () => {
    expect(bi('42').intValue()).toBe(42);
    expect(bi('42').byteValue()).toBe(42);
    expect(bi('42').shortValue()).toBe(42);
  });
});

describe('primality', () => {
  it('isProbablePrime identifies small primes and composites', () => {
    expect(bi('17').isProbablePrime(10)).toBe(true);
    expect(bi('15').isProbablePrime(10)).toBe(false);
    expect(bi('2').isProbablePrime(10)).toBe(true);
  });
});

describe('SecureRandom', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('fills an array with bytes from a CSPRNG', () => {
    const rng = new SecureRandom();
    const bytes = new Array(32).fill(0);
    rng.nextBytes(bytes);
    expect(bytes.every((b) => b === 0)).toBe(false);
    expect(bytes.every((b) => b >= 0 && b <= 255)).toBe(true);
  });

  it('falls back to Math.random and warns once when no CSPRNG is available', () => {
    vi.stubGlobal('crypto', undefined);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rng = new SecureRandom();
    const first = new Array(16).fill(0);
    const second = new Array(16).fill(0);
    rng.nextBytes(first);
    rng.nextBytes(second);
    expect(first.every((b) => b >= 0 && b <= 255)).toBe(true);
    expect(second.every((b) => b >= 0 && b <= 255)).toBe(true);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/Math\.random/);
  });
});

describe('Barrett', () => {
  it('is attached on the prototype for dependent modules', () => {
    expect(typeof NamedBigInteger.prototype.Barrett).toBe('function');
  });
});
