# Economic Union Development Requirements

## Supported environment

The Phase 1 reference environment is:

- Linux or a compatible Unix-like environment.
- Git.
- Node.js 22.x.
- npm supplied with Node.js 22.x.
- Foundry stable.
- Solidity 0.8.30, pinned in `contracts/foundry.toml`.

The local baseline recorded during WO-009 used:

- Node.js: `[COPY FROM STEP 3]`
- npm: `[COPY FROM STEP 3]`
- Forge: `[COPY FROM STEP 3]`
- Cast: `[COPY FROM STEP 3]`
- Anvil: `[COPY FROM STEP 3]`
- Chisel: `[COPY FROM STEP 3]`

## Required local verification

From `code/economic-union`:

```bash
npm ci
npm run typecheck
npm run build
npm test
```

From `code/economic-union/contracts`:

```bash
forge fmt --check
forge build
forge test
```

From `code/event-logger`:

```bash
npm test -- --run
```

## Continuous-integration boundary

GitHub Actions independently verifies:

- reproducible npm installation from `package-lock.json`;
- strict TypeScript checking;
- TypeScript compilation;
- Vitest;
- Solidity formatting;
- Solidity compilation; and
- Foundry tests.

CI does not prove:

- that the institutional design is correct;
- that unimplemented economic behavior works;
- production security;
- legal compliance;
- mainnet safety; or
- correctness beyond the committed tests and commands.

Dependency caching is intentionally absent in WO-009. It may be added only
after the uncached workflow is stable and the cache boundary is reviewed.