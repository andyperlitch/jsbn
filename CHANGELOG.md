# v1.3.0

- Port the library to TypeScript and ship dual CJS + ESM builds plus an IIFE browser bundle.
- Bundle TypeScript declarations (you can drop `@types/jsbn`).
- Always use the 28-bit `am3` multiply kernel (no user-agent sniffing). Fixes Node 21+ `navigator` and React Native.
- `SecureRandom.nextBytes` uses a CSPRNG when available; otherwise it falls back to `Math.random()` and warns once.
- `modInverse` on negative values reduces modulo `m` instead of hanging.
- Document the full public API.

# v1.2.0

Unreleased as a separate tarball; the 1.3.0 release includes these compatible fixes.

# v1.1.0

- Allow for es6 "default import", e.g. `import BigInteger from 'jsbn'`.
- Updated license file to read MIT

# v1.0.0

- breaking change: `require('jsbn')` no longer returns `BigInteger`. Use `require('jsbn').BigInteger` instead.

# v0.1.1

- fixed backwards-incompatible change in v0.1.0 where `require('jsbn') != BigInteger`. This patch version allows for `var BigInteger = require('jsbn')` or `var BigInteger = require('jsbn').BigInteger`.
