import { BigInteger } from './jsbn.js';
import BN from 'https://esm.sh/bn.js@5.2.2';
import bigInt from 'https://esm.sh/big-integer@1.6.52';
import BigNumber from 'https://esm.sh/bignumber.js@9.3.1';

BigNumber.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_DOWN });

const $ = (id) => document.getElementById(id);

function parseJsbn(s) {
  return new BigInteger(String(s).trim());
}

const demoOps = [
  ['add', 'A + B', (a, b) => a.add(b)],
  ['sub', 'A − B', (a, b) => a.subtract(b)],
  ['mul', 'A × B', (a, b) => a.multiply(b)],
  ['div', 'A / B', (a, b) => a.divide(b)],
  ['rem', 'A % B', (a, b) => a.remainder(b)],
  ['mod', 'A mod M', (a, _b, m) => a.mod(m)],
  ['pow', 'A^E', (a, _b, _m, e) => a.pow(e.intValue())],
  ['modPow', 'A^E mod M', (a, _b, m, e) => a.modPow(e, m)],
  ['gcd', 'gcd(A, B)', (a, b) => a.gcd(b)],
  ['cmp', 'compare A, B', (a, b) => a.compareTo(b)],
  ['and', 'A & B', (a, b) => a.and(b)],
  ['or', 'A | B', (a, b) => a.or(b)],
  ['xor', 'A ⊕ B', (a, b) => a.xor(b)],
  ['shl', 'A << 8', (a) => a.shiftLeft(8)],
  ['shr', 'A >> 8', (a) => a.shiftRight(8)],
  ['neg', '−A', (a) => a.negate()],
  ['abs', '|A|', (a) => a.abs()],
  ['bits', 'bitLength(A)', (a) => a.bitLength()],
  ['prime', 'isProbablePrime(A)', (a) => a.isProbablePrime(8)],
];

function showDemoError(message) {
  const err = $('demo-error');
  err.hidden = !message;
  err.textContent = message || '';
}

function runDemo(fn) {
  showDemoError('');
  try {
    const a = parseJsbn($('input-a').value);
    const b = parseJsbn($('input-b').value);
    const m = parseJsbn($('input-m').value);
    const e = parseJsbn($('input-e').value);
    const out = fn(a, b, m, e);
    const text =
      out && typeof out.toString === 'function' && !(out instanceof BigInteger)
        ? String(out)
        : out instanceof BigInteger
          ? out.toString(10)
          : String(out);
    $('demo-result').textContent = text;
    if (out instanceof BigInteger) {
      $('demo-meta').textContent =
        'sign ' + out.signum() + ' · ' + out.bitLength() + ' bits';
    } else {
      $('demo-meta').textContent = typeof out;
    }
  } catch (err) {
    $('demo-result').textContent = '—';
    $('demo-meta').textContent = '';
    showDemoError(err.message || String(err));
  }
}

function mountDemo() {
  const arith = demoOps.slice(0, 8);
  const bits = demoOps.slice(8);
  const fill = (root, ops) => {
    for (const [, label, fn] of ops) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.addEventListener('click', () => runDemo(fn));
      root.appendChild(btn);
    }
  };
  fill($('ops-arith'), arith);
  fill($('ops-bits'), bits);
  runDemo((a) => a);
}

const libs = [
  {
    id: 'jsbn',
    name: 'jsbn',
    parse: (s) => new BigInteger(s),
    add: (a, b) => a.add(b),
    sub: (a, b) => a.subtract(b),
    mul: (a, b) => a.multiply(b),
    div: (a, b) => a.divide(b),
    mod: (a, b) => a.mod(b),
    gcd: (a, b) => a.gcd(b),
    modPow: (a, e, m) => a.modPow(e, m),
    str: (a) => a.toString(10),
  },
  {
    id: 'bnjs',
    name: 'bn.js',
    parse: (s) => new BN(s, 10),
    add: (a, b) => a.add(b),
    sub: (a, b) => a.sub(b),
    mul: (a, b) => a.mul(b),
    div: (a, b) => a.div(b),
    mod: (a, b) => a.mod(b),
    gcd: (a, b) => a.gcd(b),
    modPow: (a, e, m) => a.toRed(BN.red(m)).redPow(e).fromRed(),
    str: (a) => a.toString(10),
  },
  {
    id: 'biginteger',
    name: 'big-integer',
    parse: (s) => bigInt(s),
    add: (a, b) => a.add(b),
    sub: (a, b) => a.subtract(b),
    mul: (a, b) => a.multiply(b),
    div: (a, b) => a.divide(b),
    mod: (a, b) => a.mod(b),
    gcd: (a, b) => bigInt.gcd(a, b),
    modPow: (a, e, m) => a.modPow(e, m),
    str: (a) => a.toString(),
  },
  {
    id: 'bignumber',
    name: 'bignumber.js',
    parse: (s) => new BigNumber(s),
    add: (a, b) => a.plus(b),
    sub: (a, b) => a.minus(b),
    mul: (a, b) => a.times(b),
    div: (a, b) => a.idiv(b),
    mod: (a, b) => a.mod(b),
    gcd: (a, b) => gcdBigNumber(a, b),
    modPow: null,
    str: (a) => a.toFixed(0),
  },
];

function gcdBigNumber(a, b) {
  a = a.abs();
  b = b.abs();
  while (!b.isZero()) {
    const t = b;
    b = a.mod(b);
    a = t;
  }
  return a;
}

const benchOps = [
  { id: 'parse', label: 'parse', needs: ['parse'] },
  { id: 'add', label: 'add', needs: ['add'] },
  { id: 'mul', label: 'multiply', needs: ['mul'] },
  { id: 'div', label: 'divide', needs: ['div'] },
  { id: 'mod', label: 'mod', needs: ['mod'] },
  { id: 'gcd', label: 'gcd', needs: ['gcd'] },
  { id: 'modPow', label: 'modPow', needs: ['modPow'] },
  { id: 'toString', label: 'toString', needs: ['str'] },
];

function randomDecimal(bits) {
  const bytes = Math.ceil(bits / 8);
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  buf[0] = buf[0] | 0x80;
  let hex = '';
  for (const b of buf) hex += b.toString(16).padStart(2, '0');
  return BigInt('0x' + hex).toString(10);
}

function oddDecimal(s) {
  const last = Number(s[s.length - 1]);
  if (last % 2 === 1) return s;
  return s.slice(0, -1) + String((last + 1) % 10);
}

function gcdBigInt(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function modPowBigInt(base, exp, mod) {
  if (mod === 1n) return 0n;
  let result = 1n;
  base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

function oracleStrings(aStr, bStr, wideStr, mStr, eStr) {
  const a = BigInt(aStr);
  const b = BigInt(bStr);
  const wide = BigInt(wideStr);
  const m = BigInt(mStr);
  const e = BigInt(eStr);
  return {
    parse: wideStr,
    add: (a + b).toString(10),
    mul: (a * b).toString(10),
    div: (wide / m).toString(10),
    mod: (wide % m).toString(10),
    gcd: gcdBigInt(a, b).toString(10),
    modPow: modPowBigInt(a, e, m).toString(10),
    toString: wideStr,
  };
}

function onceDecimal(lib, opId, parsed) {
  const { a, b, wide, m, e, wideStr } = parsed;
  if (opId === 'parse') return lib.str(lib.parse(wideStr));
  if (opId === 'toString') return lib.str(wide);
  if (opId === 'modPow') return lib.str(lib.modPow(a, e, m));
  if (opId === 'div' || opId === 'mod') return lib.str(lib[opId](wide, m));
  return lib.str(lib[opId](a, b));
}

function timeOp(lib, opId, iters, parsed) {
  const { a, b, wide, m, e, wideStr } = parsed;
  if (opId === 'parse') {
    for (let i = 0; i < iters; i++) lib.parse(wideStr);
    return;
  }
  if (opId === 'toString') {
    for (let i = 0; i < iters; i++) lib.str(wide);
    return;
  }
  if (opId === 'modPow') {
    const rounds = Math.max(1, Math.floor(iters / 10));
    for (let i = 0; i < rounds; i++) lib.modPow(a, e, m);
    return;
  }
  if (opId === 'div' || opId === 'mod') {
    const fn = lib[opId];
    for (let i = 0; i < iters; i++) fn(wide, m);
    return;
  }
  const fn = lib[opId];
  for (let i = 0; i < iters; i++) fn(a, b);
}

function yieldUi() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

function timeMs(fn) {
  const t0 = performance.now();
  fn();
  return performance.now() - t0;
}

const results = new Map();

function cellMetric(t, best, max, extraClass) {
  let extra = 'metric' + (extraClass ? ' ' + extraClass : '');
  let label = '…';
  let width = 0;
  if (t === 'n/a') {
    extra += ' na';
    label = 'n/a';
  } else if (t === 'fail') {
    extra += ' fail';
    label = 'fail';
  } else if (typeof t === 'number') {
    if (t === best) extra += ' fast';
    label = t.toFixed(1) + ' ms';
    width = max ? Math.max(4, Math.round((t / max) * 100)) : 4;
  } else {
    extra += ' na';
  }
  const title = t === 'fail' ? ' title="result does not match native BigInt"' : '';
  return (
    '<div class="' +
    extra +
    '"' +
    title +
    '><div class="metric-row"><span class="time">' +
    label +
    '</span><div class="bar-track">' +
    (width ? '<div class="bar" style="width:' + width + '%"></div>' : '') +
    '</div></div></div>'
  );
}

function renderTable() {
  const wrap = $('bench-table-wrap');
  let html =
    '<div class="bench-grid"><div class="bench-h">Operation</div><div class="bench-h">Library</div><div class="bench-h">Time</div>';
  for (const op of benchOps) {
    const times = libs.map((l) => results.get(l.id + ':' + op.id));
    const numeric = times.filter((t) => typeof t === 'number');
    const best = numeric.length ? Math.min(...numeric) : null;
    const max = numeric.length ? Math.max(...numeric) : null;
    html += '<div class="op">' + op.label + '</div>';
    for (let i = 0; i < libs.length; i++) {
      const end = i === libs.length - 1 ? 'op-end' : '';
      const win =
        typeof times[i] === 'number' && times[i] === best ? ' fast' : '';
      html +=
        '<div class="lib' +
        (end ? ' op-end' : '') +
        win +
        '">' +
        libs[i].name +
        '</div>';
      html += cellMetric(times[i], best, max, end);
    }
  }
  html += '</div>';
  wrap.innerHTML = html;
}

async function runSuite(ev) {
  ev.preventDefault();
  const runBtn = $('bench-run');
  runBtn.disabled = true;
  results.clear();
  renderTable();

  const bits = Number($('bench-bits').value);
  const iters = Number($('bench-iters').value);
  const aStr = randomDecimal(bits);
  const bStr = randomDecimal(bits);
  // Double-width dividend so divide/mod are real long division, not 0/1 quotients.
  const wideStr = randomDecimal(bits * 2);
  // bn.js Montgomery reduction requires an odd modulus; match operand width.
  const mStr = oddDecimal(randomDecimal(bits));
  const eStr = randomDecimal(Math.min(256, bits));
  const expected = oracleStrings(aStr, bStr, wideStr, mStr, eStr);
  let fails = 0;

  for (const lib of libs) {
    for (const op of benchOps) {
      $('bench-status').textContent = 'Running ' + lib.name + ' · ' + op.label;
      await yieldUi();
      const key = lib.id + ':' + op.id;
      if (op.needs.some((n) => !lib[n])) {
        results.set(key, 'n/a');
        renderTable();
        continue;
      }
      try {
        const parsed = {
          a: lib.parse(aStr),
          b: lib.parse(bStr),
          wide: lib.parse(wideStr),
          m: lib.parse(mStr),
          e: lib.parse(eStr),
          wideStr,
        };
        if (op.id !== 'parse') {
          lib.add(parsed.a, parsed.b);
        }
        const ms = timeMs(() => timeOp(lib, op.id, iters, parsed));
        const got = onceDecimal(lib, op.id, parsed);
        if (got !== expected[op.id]) {
          fails += 1;
          results.set(key, 'fail');
          console.warn(lib.name, op.id, 'expected', expected[op.id], 'got', got);
        } else {
          results.set(key, ms);
        }
      } catch (err) {
        fails += 1;
        results.set(key, 'fail');
        console.warn(lib.name, op.id, err);
      }
      renderTable();
    }
  }

  $('bench-status').textContent =
    'Done. Fastest cell in each row is bold. Checked once per cell against native BigInt' +
    (fails ? ' — ' + fails + ' fail.' : '.') +
    ' ' +
    bits +
    '-bit operands (' +
    bits * 2 +
    '-bit dividend for div/mod/parse/toString), ' +
    iters +
    ' iterations (modPow uses 1/10th, 256-bit exponent).';
  runBtn.disabled = false;
}

function mountTabs() {
  const demoBtn = $('tab-demo');
  const benchBtn = $('tab-bench');
  const demoPanel = $('panel-demo');
  const benchPanel = $('panel-bench');
  const select = (which) => {
    const demo = which === 'demo';
    demoBtn.setAttribute('aria-selected', String(demo));
    benchBtn.setAttribute('aria-selected', String(!demo));
    demoPanel.hidden = !demo;
    benchPanel.hidden = demo;
  };
  demoBtn.addEventListener('click', () => select('demo'));
  benchBtn.addEventListener('click', () => select('bench'));
}

mountTabs();
mountDemo();
$('bench-form').addEventListener('submit', runSuite);
renderTable();
