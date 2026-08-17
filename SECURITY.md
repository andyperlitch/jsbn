# Security Policy

jsbn is a general-purpose big-integer library, not a constant-time cryptographic implementation. Timing variation in `modPow`, `modInverse`, `compareTo`, and related operations can leak information. Do not use this package to implement new public-key cryptography.

`SecureRandom.nextBytes` uses a platform CSPRNG (`globalThis.crypto.getRandomValues` or Node's `crypto`) when one exists. If none is available it falls back to `Math.random()` and prints a one-time warning. That fallback is not cryptographic.

## Reporting a vulnerability

Please open a [GitHub security advisory](https://github.com/andyperlitch/jsbn/security/advisories) or an issue on this repository if advisories are not available.
