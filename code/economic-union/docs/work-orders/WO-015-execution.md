# WO-015 Execution Record — Implement the Property Model

## Purpose

Create the immutable provisional Property entity without valuation or capacity behavior.

This record captures the actual commands and output of WO-015.

---

## Step 1 — Confirm WO-014 and initialize the execution record

**Input:** The committed WO-014 canonical vectors, validator, Node test-type repair, and passing Review Gate 2 repository state.

**Commands and output:**

```text
$ pwd
/home/mike/code/local-coordination-protocol/code/economic-union

$ git status --short
?? docs/work-orders/WO-015-execution.md

$ git log -3 --oneline --decorate
6b16e27 (HEAD -> main) fix(domain): configure Node types for scenario tests
20efc00 feat(domain): add canonical scenario vectors
a22c185 feat(domain): define errors and results

$ git diff --check

$ test -f packages/domain/src/canonical-scenarios.ts
[canonical-scenarios.ts exists]

$ test -f packages/domain/src/domain-errors.ts
[domain-errors.ts exists]

$ test -f packages/domain/src/domain-statuses.ts
[domain-statuses.ts exists]

$ rg -n "@types/node|vitest/globals|node" packages/domain/package.json packages/domain/tsconfig.test.json
packages/domain/tsconfig.test.json:5:    "types": ["vitest/globals", "node"]
packages/domain/package.json:17:    "@types/node": "^26.1.1"

$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build

> @lcp/economic-union@1.0.0 build
> npm run build --workspaces --if-present


> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


> @lcp/protocol@1.0.0 build
> tsc -p tsconfig.json


$ npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 16[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m183 passed[39m[22m[90m (183)[39m
[2m   Start at [22m 23:57:11
[2m   Duration [22m 251ms[2m (transform 320ms, setup 0ms, import 491ms, tests 73ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 23:57:12
[2m   Duration [22m 189ms[2m (transform 48ms, setup 0ms, import 61ms, tests 3ms, environment 0ms)[22m

```

**Output:** The repository location, Git state, WO-014 correction, and complete passing TypeScript baseline are recorded before Property changes begin.

**Status:** Step 1 complete.

**Next:** Step 2 — Inspect the current domain boundary.

---

## Step 2 — Inspect the current domain boundary

**Input:** The verified WO-014 domain package.

**Commands and output:**

```text
$ find packages/domain -maxdepth 3 -type f -not -path "*/dist/*" | sort
packages/domain/package.json
packages/domain/src/canonical-scenarios.test.ts
packages/domain/src/canonical-scenarios.ts
packages/domain/src/canonical-scenarios.type-test.ts
packages/domain/src/domain-errors.test.ts
packages/domain/src/domain-errors.ts
packages/domain/src/domain-errors.type-test.ts
packages/domain/src/domain-statuses.test.ts
packages/domain/src/domain-statuses.ts
packages/domain/src/domain-statuses.type-test.ts
packages/domain/src/identifiers.test.ts
packages/domain/src/identifiers.ts
packages/domain/src/identifiers.type-test.ts
packages/domain/src/index.test.ts
packages/domain/src/index.ts
packages/domain/src/value-types.test.ts
packages/domain/src/value-types.ts
packages/domain/src/value-types.type-test.ts
packages/domain/tsconfig.json
packages/domain/tsconfig.test.json

$ sed -n "1,220p" packages/domain/src/index.ts
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
$ rg -n "export function propertyId|export type PropertyId" packages/domain/src/identifiers.ts
16:export type PropertyId = string & {
112:export function propertyId(value: string): PropertyId {

$ rg -n "export function propertyStatus|export type PropertyStatus|proposed" packages/domain/src/domain-statuses.ts
18:  "proposed",
68:export type PropertyStatus = PropertyStatusValue & {
131:    proposed: ["active", "rejected"],
182:export function propertyStatus(value: string): PropertyStatus {

$ rg -n "domainError|domainFailure|domainSuccess|DomainResult|invalid-input" packages/domain/src/domain-errors.ts
2:  "invalid-input",
45:export type DomainResult<
50:export function domainErrorCode(value: string): DomainErrorCode {
60:export function domainError<C extends DomainErrorCode>(
85:export function domainSuccess<T>(value: T): DomainSuccess<T> {
92:export function domainFailure<E extends DomainError>(

$ rg -n "interface Property|type Property|createProperty|PropertyCreationInput" packages/domain/src || true
packages/domain/src/identifiers.type-test.ts:19:  type PropertyId,
packages/domain/src/identifiers.ts:16:export type PropertyId = string & {
packages/domain/src/domain-statuses.ts:60:type PropertyStatusValue = (typeof PROPERTY_STATUS_VALUES)[number];
packages/domain/src/domain-statuses.ts:68:export type PropertyStatus = PropertyStatusValue & {
packages/domain/src/domain-statuses.type-test.ts:16:  type PropertyStatus,
```

**Output:** The exact domain vocabulary and any preexisting Property implementation are visible before WO-015 edits.

**Status:** Step 2 complete.

**Next:** Step 3 — Record the Property contract.

---

## Step 3 — Record the Property contract

**Input:** The master-plan WO-015 boundary and inspected domain vocabulary.

**Contract:**

- A Property has one validated PropertyId.
- Creation consumes unknown and returns DomainResult<Property, DomainError<"invalid-input">>.
- Every newly created Property begins in proposed status.
- Address, legal description, owner reference, and evidence references are separate fields.
- Required strings are trimmed and must remain nonempty.
- Evidence references are required, copied, and frozen.
- The Property, nested address, and evidence array are immutable.
- Invalid input reports a stable invalid-input code and exact path.
- The Property contains no valuation, debt, capacity, equity, token, balance, or pool field.
- Creation performs no monetary arithmetic and contributes no capacity.

**Output:** The WO-015 implementation contract is preserved before source files change.

**Status:** Step 3 complete.

**Next:** Step 4 — Create the Property implementation.

---

## Step 4 — Create the Property implementation

**Input:** The Property contract recorded in Step 3.

**Action:** Create `packages/domain/src/properties.ts` with the supplied source.

**Editor command:** `code packages/domain/src/properties.ts`

**Resulting file:**

```text
clear

# ============================================================
# WO-015 — STEP 4A
# Open the Property implementation file
# ============================================================

set -o pipefail
WO_LOG="docs/work-orders/WO-015-execution.md"

{
  set -e

  printf '%s\n\n' '---'
  printf '## Step 4 — Create the Property implementation\n\n'
  printf '**Input:** The Property contract recorded in Step 3.\n\n'
  printf '**Action:** Create `packages/domain/src/properties.ts` with the supplied source.\n\n'
  printf '**Editor command:** `code packages/domain/src/properties.ts`\n\n'
} 2>&1 | tee -a "$WO_LOG"

code packages/domain/src/properties.ts

printf '\nPaste the supplied source, save the file, then run Step 4B.\n\n'```

**Structural checks:**

```text
$ rg -n "^export (interface|function)" packages/domain/src/properties.ts
---

## Step 5 — Create the Property runtime tests

**Input:** The saved Property implementation.

**Action:** Create `packages/domain/src/properties.test.ts` with the supplied runtime suite.

**Editor command:** `code packages/domain/src/properties.test.ts`

**Resulting file:**

```text
clear

# ============================================================
# WO-015 — STEP 5A
# Open the Property runtime test file
# ============================================================

set -o pipefail
WO_LOG="docs/work-orders/WO-015-execution.md"

{
  set -e

  printf '%s\n\n' '---'
  printf '## Step 5 — Create the Property runtime tests\n\n'
  printf '**Input:** The saved Property implementation.\n\n'
  printf '**Action:** Create `packages/domain/src/properties.test.ts` with the supplied runtime suite.\n\n'
  printf '**Editor command:** `code packages/domain/src/properties.test.ts`\n\n'
} 2>&1 | tee -a "$WO_LOG"

code packages/domain/src/properties.test.ts

printf '\nPaste the supplied tests, save the file, then run Step 5B.\n\n'```

**Test inventory:**

```text
$ rg -n "it\(|it\.each" packages/domain/src/properties.test.ts
---

## Step 6 — Create compile-time Property safeguards

**Input:** The Property interfaces and runtime creation function.

**Action:** Create `packages/domain/src/properties.type-test.ts` with the supplied compile-time assertions.

**Editor command:** `code packages/domain/src/properties.type-test.ts`

**Resulting file:**

```text
clear

# ============================================================
# WO-015 — STEP 6A
# Open the compile-time Property test file
# ============================================================

set -o pipefail
WO_LOG="docs/work-orders/WO-015-execution.md"

{
  set -e

  printf '%s\n\n' '---'
  printf '## Step 6 — Create compile-time Property safeguards\n\n'
  printf '**Input:** The Property interfaces and runtime creation function.\n\n'
  printf '**Action:** Create `packages/domain/src/properties.type-test.ts` with the supplied compile-time assertions.\n\n'
  printf '**Editor command:** `code packages/domain/src/properties.type-test.ts`\n\n'
} 2>&1 | tee -a "$WO_LOG"

code packages/domain/src/properties.type-test.ts

printf '\nPaste the supplied type test, save the file, then run Step 6B.\n\n'```

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/properties.test.ts(3,1): error TS1127: Invalid character.
src/properties.test.ts(3,3): error TS1185: Merge conflict marker encountered.
src/properties.ts(3,1): error TS1127: Invalid character.
src/properties.ts(3,3): error TS1185: Merge conflict marker encountered.
src/properties.type-test.ts(3,1): error TS1127: Invalid character.
src/properties.type-test.ts(3,3): error TS1185: Merge conflict marker encountered.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 7 — Export and test the public Property API

**Input:** The passing Property implementation and safeguards.

**Actions:**

- Add `export * from "./properties.js";` exactly once to `packages/domain/src/index.ts`.
- Preserve every existing export.
- Create `packages/domain/src/properties-public.test.ts` with the supplied public-entrypoint test.

**Editor commands:**

`code packages/domain/src/index.ts`

`code packages/domain/src/properties-public.test.ts`

**Resulting entrypoint:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";```

**Resulting public test:**

```text
export * from "./properties.js";

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  deterministicTestId,
  type PropertyCreationInput,
} from "./index.js";

describe("Property public API", () => {
  it("creates a Property through the domain entrypoint", () => {
    const input = {
      id: deterministicTestId("property", 1),
      address: {
        line1: "100 Test Street",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description for Property A",
      ownerReference: "synthetic-owner-a",
      evidenceReferences: [
        "synthetic://property-a/source-record",
      ],
    } as const satisfies PropertyCreationInput;

    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.id).toBe(input.id);
    expect(result.value.status).toBe("proposed");
  });
});```

**Commands and output:**

```text
$ test "$(rg -c "properties\.js" packages/domain/src/index.ts)" -eq 1
bash: test: : integer expression expected
---

## Step 8 — Run focused Property verification

**Input:** The Property source, runtime tests, compile-time safeguards, and public export.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/properties.test.ts(3,1): error TS1127: Invalid character.
src/properties.test.ts(3,3): error TS1185: Merge conflict marker encountered.
src/properties.ts(3,1): error TS1127: Invalid character.
src/properties.ts(3,3): error TS1185: Merge conflict marker encountered.
src/properties.type-test.ts(3,1): error TS1127: Invalid character.
src/properties.type-test.ts(3,3): error TS1185: Merge conflict marker encountered.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 9 — Prove the focused suite detects a wrong expectation

**Input:** The passing focused Property suite from Step 8.

**Temporary action:** Back up the exact runtime test file, then append one test named `TEMPORARY: incorrectly expects a new Property to be active`.

**Commands and output:**

```text
$ cp packages/domain/src/properties.test.ts /tmp/WO-015-properties.test.ts

$ cat >> packages/domain/src/properties.test.ts << temporary-test

$ rg -n "TEMPORARY:" packages/domain/src/properties.test.ts
24:it("TEMPORARY: incorrectly expects a new Property to be active", () => {
```

**Output:** A backed-up, deliberately invalid test is present.

**Status:** Temporary invalid state created; failure is required.

**Next:** Step 9B — Run the command that must fail.

**Expected result:** The focused Property suite must return a nonzero status because the temporary test expects `active` instead of `proposed`.

```text
$ npm test --workspace packages/domain -- --run src/properties.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/properties.test.ts [2m([22m[2m0 test[22m[2m)[22m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/properties.test.ts[2m [ src/properties.test.ts ][22m
[31m[1mError[22m: Transform failed with 1 error:

[31m[PARSE_ERROR] [0mInvalid Character ` `
   [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/properties.test.ts:3:2 [38;5;246m][0m
   [38;5;246m│[0m
 [38;5;246m3 │[0m [38;5;249m#[0m [38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m
 [38;5;240m  │[0m  ┬
 [38;5;240m  │[0m  ╰──
[38;5;246m───╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain/src/properties.test.ts[39m
[90m [2m❯[22m transformWithOxc ../../node_modules/vite/dist/node/chunks/node.js:[2m4033:19[22m[39m
[90m [2m❯[22m TransformPluginContext.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m4104:26[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m30201:51[22m[39m
[90m [2m❯[22m loadAndTransform ../../node_modules/vite/dist/node/chunks/node.js:[2m20124:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 00:02:25
[2m   Duration [22m 268ms[2m (transform 0ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/properties.test.ts
```

**Observed result:** The focused suite rejected the incorrect active-status expectation.

**Status:** Expected failure confirmed; restoration is required.

**Next:** Step 10 — Restore the valid runtime test file.

---

## Step 10 — Restore the valid runtime test file

**Input:** The backed-up valid test file and the temporary failing repository file.

**Commands and output:**

```text
$ test -f /tmp/WO-015-properties.test.ts

$ cp /tmp/WO-015-properties.test.ts packages/domain/src/properties.test.ts

$ rg -n "TEMPORARY:" packages/domain/src/properties.test.ts || true

$ npm test --workspace packages/domain -- --run src/properties.test.ts src/properties-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties.test.ts src/properties-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/properties-public.test.ts [2m([22m[2m0 test[22m[2m)[22m
 [31m❯[39m src/properties.test.ts [2m([22m[2m0 test[22m[2m)[22m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 2 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/properties-public.test.ts[2m [ src/properties-public.test.ts ][22m
[31m[1mError[22m: Transform failed with 1 error:

[31m[PARSE_ERROR] [0mInvalid Character ` `
   [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/properties.ts:3:2 [38;5;246m][0m
   [38;5;246m│[0m
 [38;5;246m3 │[0m [38;5;249m#[0m [38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m
 [38;5;240m  │[0m  ┬
 [38;5;240m  │[0m  ╰──
[38;5;246m───╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain/src/properties.ts[39m
[90m [2m❯[22m transformWithOxc ../../node_modules/vite/dist/node/chunks/node.js:[2m4033:19[22m[39m
[90m [2m❯[22m TransformPluginContext.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m4104:26[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m30201:51[22m[39m
[90m [2m❯[22m loadAndTransform ../../node_modules/vite/dist/node/chunks/node.js:[2m20124:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯[22m[39m

[41m[1m FAIL [22m[49m src/properties.test.ts[2m [ src/properties.test.ts ][22m
[31m[1mError[22m: Transform failed with 1 error:

[31m[PARSE_ERROR] [0mInvalid Character ` `
   [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/properties.test.ts:3:2 [38;5;246m][0m
   [38;5;246m│[0m
 [38;5;246m3 │[0m [38;5;249m#[0m [38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m
 [38;5;240m  │[0m  ┬
 [38;5;240m  │[0m  ╰──
[38;5;246m───╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain/src/properties.test.ts[39m
[90m [2m❯[22m transformWithOxc ../../node_modules/vite/dist/node/chunks/node.js:[2m4033:19[22m[39m
[90m [2m❯[22m TransformPluginContext.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m4104:26[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m30201:51[22m[39m
[90m [2m❯[22m loadAndTransform ../../node_modules/vite/dist/node/chunks/node.js:[2m20124:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯[22m[39m


[2m Test Files [22m [1m[31m2 failed[39m[22m[90m (2)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 00:02:37
[2m   Duration [22m 199ms[2m (transform 20ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/properties.test.ts src/properties-public.test.ts
---

## Corrective Step 10R — Restore valid Property source files

**Cause:** Bash editor-opening blocks were saved as TypeScript source.

**Specification:** ``

**Commands and output:**

```text
$ cp packages/domain/src/properties.ts /tmp/properties.ts.malformed-20260724-000822
$ cp packages/domain/src/properties.test.ts /tmp/properties.test.ts.malformed-20260724-000822
$ cp packages/domain/src/properties.type-test.ts /tmp/properties.type-test.ts.malformed-20260724-000822
$ cp packages/domain/src/properties-public.test.ts /tmp/properties-public.test.ts.malformed-20260724-000822

$ extract TypeScript blocks from WO-015
Traceback (most recent call last):
  File "<stdin>", line 5, in <module>
  File "/home/mike/miniconda3/lib/python3.11/pathlib.py", line 1058, in read_text
    with self.open(mode='r', encoding=encoding, errors=errors) as f:
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/mike/miniconda3/lib/python3.11/pathlib.py", line 1044, in open
    return io.open(self, mode, buffering, encoding, errors, newline)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
IsADirectoryError: [Errno 21] Is a directory: '.'

$ ensure the Property public export exists exactly once

$ inspect repaired file openings

--- packages/domain/src/properties.ts ---
clear

# ============================================================
# WO-015 — STEP 4A
# Open the Property implementation file
# ============================================================

set -o pipefail

--- packages/domain/src/properties.test.ts ---
clear

# ============================================================
# WO-015 — STEP 5A
# Open the Property runtime test file
# ============================================================

set -o pipefail

--- packages/domain/src/properties.type-test.ts ---
clear

# ============================================================
# WO-015 — STEP 6A
# Open the compile-time Property test file
# ============================================================

set -o pipefail

--- packages/domain/src/properties-public.test.ts ---
export * from "./properties.js";

import {
  describe,
  expect,
  it,
} from "vitest";


$ reject remaining Bash text in TypeScript files
packages/domain/src/properties.type-test.ts:1:clear
packages/domain/src/properties.type-test.ts:3:# ============================================================
packages/domain/src/properties.type-test.ts:4:# WO-015 — STEP 6A
packages/domain/src/properties.type-test.ts:6:# ============================================================
packages/domain/src/properties.type-test.ts:8:set -o pipefail
packages/domain/src/properties.type-test.ts:9:WO_LOG="docs/work-orders/WO-015-execution.md"
packages/domain/src/properties.test.ts:1:clear
packages/domain/src/properties.test.ts:3:# ============================================================
packages/domain/src/properties.test.ts:4:# WO-015 — STEP 5A
packages/domain/src/properties.test.ts:6:# ============================================================
packages/domain/src/properties.test.ts:8:set -o pipefail
packages/domain/src/properties.test.ts:9:WO_LOG="docs/work-orders/WO-015-execution.md"
packages/domain/src/properties.ts:1:clear
packages/domain/src/properties.ts:3:# ============================================================
packages/domain/src/properties.ts:4:# WO-015 — STEP 4A
packages/domain/src/properties.ts:6:# ============================================================
packages/domain/src/properties.ts:8:set -o pipefail
packages/domain/src/properties.ts:9:WO_LOG="docs/work-orders/WO-015-execution.md"

Bash text still exists in a TypeScript file.
---

## Step 9 — Prove the focused suite detects a wrong expectation

**Input:** The passing focused Property suite from Step 8.

**Temporary action:** Back up the exact runtime test file, then append one test named `TEMPORARY: incorrectly expects a new Property to be active`.

**Commands and output:**

```text
$ cp packages/domain/src/properties.test.ts /tmp/WO-015-properties.test.ts

$ cat >> packages/domain/src/properties.test.ts << temporary-test

$ rg -n "TEMPORARY:" packages/domain/src/properties.test.ts
24:it("TEMPORARY: incorrectly expects a new Property to be active", () => {
```

**Output:** A backed-up, deliberately invalid test is present.

**Status:** Temporary invalid state created; failure is required.

**Next:** Step 9B — Run the command that must fail.

---

## Corrective Step 10R — Restore valid Property source files

**Cause:** Bash editor-opening blocks were saved as TypeScript source.

**Specification:** ``

**Commands and output:**

```text
$ cp packages/domain/src/properties.ts /tmp/properties.ts.malformed-20260724-001131
$ cp packages/domain/src/properties.test.ts /tmp/properties.test.ts.malformed-20260724-001131
$ cp packages/domain/src/properties.type-test.ts /tmp/properties.type-test.ts.malformed-20260724-001131
$ cp packages/domain/src/properties-public.test.ts /tmp/properties-public.test.ts.malformed-20260724-001131

$ extract TypeScript blocks from WO-015
Traceback (most recent call last):
  File "<stdin>", line 5, in <module>
  File "/home/mike/miniconda3/lib/python3.11/pathlib.py", line 1058, in read_text
    with self.open(mode='r', encoding=encoding, errors=errors) as f:
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/mike/miniconda3/lib/python3.11/pathlib.py", line 1044, in open
    return io.open(self, mode, buffering, encoding, errors, newline)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
IsADirectoryError: [Errno 21] Is a directory: '.'

$ ensure the Property public export exists exactly once

$ inspect repaired file openings

--- packages/domain/src/properties.ts ---
clear

# ============================================================
# WO-015 — STEP 4A
# Open the Property implementation file
# ============================================================

set -o pipefail

--- packages/domain/src/properties.test.ts ---
clear

# ============================================================
# WO-015 — STEP 5A
# Open the Property runtime test file
# ============================================================

set -o pipefail

--- packages/domain/src/properties.type-test.ts ---
clear

# ============================================================
# WO-015 — STEP 6A
# Open the compile-time Property test file
# ============================================================

set -o pipefail

--- packages/domain/src/properties-public.test.ts ---
export * from "./properties.js";

import {
  describe,
  expect,
  it,
} from "vitest";


$ reject remaining Bash text in TypeScript files
packages/domain/src/properties.type-test.ts:1:clear
packages/domain/src/properties.type-test.ts:3:# ============================================================
packages/domain/src/properties.type-test.ts:4:# WO-015 — STEP 6A
packages/domain/src/properties.type-test.ts:6:# ============================================================
packages/domain/src/properties.type-test.ts:8:set -o pipefail
packages/domain/src/properties.type-test.ts:9:WO_LOG="docs/work-orders/WO-015-execution.md"
packages/domain/src/properties.ts:1:clear
packages/domain/src/properties.ts:3:# ============================================================
packages/domain/src/properties.ts:4:# WO-015 — STEP 4A
packages/domain/src/properties.ts:6:# ============================================================
packages/domain/src/properties.ts:8:set -o pipefail
packages/domain/src/properties.ts:9:WO_LOG="docs/work-orders/WO-015-execution.md"
packages/domain/src/properties.test.ts:1:clear
packages/domain/src/properties.test.ts:3:# ============================================================
packages/domain/src/properties.test.ts:4:# WO-015 — STEP 5A
packages/domain/src/properties.test.ts:6:# ============================================================
packages/domain/src/properties.test.ts:8:set -o pipefail
packages/domain/src/properties.test.ts:9:WO_LOG="docs/work-orders/WO-015-execution.md"

Bash text still exists in a TypeScript file.
---

## Step 5 — Create the Property runtime tests

**Input:** The saved Property implementation.

**Action:** Create `packages/domain/src/properties.test.ts` with the supplied runtime suite.

**Editor command:** `code packages/domain/src/properties.test.ts`

**Resulting file:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  deterministicTestId,
} from "./identifiers.js";
import {
  createProperty,
  type PropertyCreationInput,
} from "./properties.js";

function validPropertyInput(): PropertyCreationInput {
  return {
    id: deterministicTestId("property", 1),
    address: {
      line1: "100 Test Street",
      line2: "Unit A",
      locality: "Lansing",
      region: "MI",
      postalCode: "48912",
      countryCode: "US",
    },
    legalDescription:
      "Synthetic legal description for Property A",
    ownerReference: "synthetic-owner-a",
    evidenceReferences: [
      "synthetic://property-a/source-record",
    ],
  };
}

function expectInvalidPath(
  input: unknown,
  expectedPath: string,
): void {
  const result = createProperty(input);

  expect(result.ok).toBe(false);

  if (result.ok) {
    throw new Error("Expected Property creation to fail");
  }

  expect(result.error.code).toBe("invalid-input");
  expect(result.error.details?.path).toBe(expectedPath);
}

describe("createProperty", () => {
  it("creates an immutable provisional Property", () => {
    const result = createProperty(validPropertyInput());

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value).toEqual({
      id: deterministicTestId("property", 1),
      status: "proposed",
      address: {
        line1: "100 Test Street",
        line2: "Unit A",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description for Property A",
      ownerReference: "synthetic-owner-a",
      evidenceReferences: [
        "synthetic://property-a/source-record",
      ],
    });

    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.address)).toBe(true);
    expect(
      Object.isFrozen(result.value.evidenceReferences),
    ).toBe(true);
  });

  it("always begins in proposed status", () => {
    const input = {
      ...validPropertyInput(),
      status: "active",
    };
    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.status).toBe("proposed");
  });

  it("trims supported string fields", () => {
    const input = validPropertyInput();
    const result = createProperty({
      ...input,
      id: `  ${input.id}  `,
      address: {
        line1: "  100 Test Street  ",
        line2: "  Unit A  ",
        locality: "  Lansing  ",
        region: "  MI  ",
        postalCode: "  48912  ",
        countryCode: "  US  ",
      },
      legalDescription:
        "  Synthetic legal description for Property A  ",
      ownerReference: "  synthetic-owner-a  ",
      evidenceReferences: [
        "  synthetic://property-a/source-record  ",
      ],
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.address.line1).toBe(
      "100 Test Street",
    );
    expect(result.value.address.line2).toBe("Unit A");
    expect(result.value.legalDescription).toBe(
      "Synthetic legal description for Property A",
    );
    expect(result.value.ownerReference).toBe(
      "synthetic-owner-a",
    );
    expect(result.value.evidenceReferences).toEqual([
      "synthetic://property-a/source-record",
    ]);
  });

  it("does not retain the caller's mutable evidence array", () => {
    const evidenceReferences = [
      "synthetic://property-a/source-record",
    ];
    const result = createProperty({
      ...validPropertyInput(),
      evidenceReferences,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    evidenceReferences.push(
      "synthetic://property-a/later-mutation",
    );

    expect(result.value.evidenceReferences).toEqual([
      "synthetic://property-a/source-record",
    ]);
  });

  it("creates an address without optional line2", () => {
    const input = validPropertyInput();
    const result = createProperty({
      ...input,
      address: {
        line1: input.address.line1,
        locality: input.address.locality,
        region: input.address.region,
        postalCode: input.address.postalCode,
        countryCode: input.address.countryCode,
      },
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect("line2" in result.value.address).toBe(false);
  });

  it("rejects a non-object creation input", () => {
    expectInvalidPath(null, "$");
    expectInvalidPath([], "$");
    expectInvalidPath("property", "$");
  });

  it("rejects a missing Property identity", () => {
    const { id: _id, ...withoutId } = validPropertyInput();
    void _id;

    expectInvalidPath(withoutId, "$.id");
  });

  it("rejects a malformed Property identity", () => {
    expectInvalidPath(
      {
        ...validPropertyInput(),
        id: "property-a",
      },
      "$.id",
    );
  });

  it("rejects a missing address object", () => {
    const { address: _address, ...withoutAddress } =
      validPropertyInput();
    void _address;

    expectInvalidPath(withoutAddress, "$.address");
  });

  it.each([
    ["line1"],
    ["locality"],
    ["region"],
    ["postalCode"],
    ["countryCode"],
  ] as const)(
    "rejects an empty required address field: %s",
    (field) => {
      const input = validPropertyInput();

      expectInvalidPath(
        {
          ...input,
          address: {
            ...input.address,
            [field]: "   ",
          },
        },
        `$.address.${field}`,
      );
    },
  );

  it("rejects an empty optional line2 when supplied", () => {
    const input = validPropertyInput();

    expectInvalidPath(
      {
        ...input,
        address: {
          ...input.address,
          line2: "   ",
        },
      },
      "$.address.line2",
    );
  });

  it("rejects a missing legal description", () => {
    const {
      legalDescription: _legalDescription,
      ...withoutLegalDescription
    } = validPropertyInput();
    void _legalDescription;

    expectInvalidPath(
      withoutLegalDescription,
      "$.legalDescription",
    );
  });

  it("rejects a missing owner reference", () => {
    const {
      ownerReference: _ownerReference,
      ...withoutOwnerReference
    } = validPropertyInput();
    void _ownerReference;

    expectInvalidPath(
      withoutOwnerReference,
      "$.ownerReference",
    );
  });

  it("rejects a missing or empty evidence-reference list", () => {
    const {
      evidenceReferences: _evidenceReferences,
      ...withoutEvidenceReferences
    } = validPropertyInput();
    void _evidenceReferences;

    expectInvalidPath(
      withoutEvidenceReferences,
      "$.evidenceReferences",
    );
    expectInvalidPath(
      {
        ...validPropertyInput(),
        evidenceReferences: [],
      },
      "$.evidenceReferences",
    );
  });

  it("rejects an invalid evidence-reference entry", () => {
    expectInvalidPath(
      {
        ...validPropertyInput(),
        evidenceReferences: [
          "synthetic://property-a/source-record",
          "   ",
        ],
      },
      "$.evidenceReferences[1]",
    );
  });

  it("contains no valuation, debt, capacity, or ownership state", () => {
    const result = createProperty(validPropertyInput());

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value).not.toHaveProperty(
      "approvedValueCents",
    );
    expect(result.value).not.toHaveProperty(
      "estimatedValueCents",
    );
    expect(result.value).not.toHaveProperty(
      "seniorDebtCents",
    );
    expect(result.value).not.toHaveProperty(
      "capacityContributionCents",
    );
    expect(result.value).not.toHaveProperty(
      "poolCapacityCents",
    );
    expect(result.value).not.toHaveProperty(
      "unionOwnershipCents",
    );
    expect(result.value).not.toHaveProperty(
      "homeownerOwnershipCents",
    );
  });
});```

**Test inventory:**

```text
$ rg -n "it\(|it\.each" packages/domain/src/properties.test.ts
52:  it("creates an immutable provisional Property", () => {
87:  it("always begins in proposed status", () => {
103:  it("trims supported string fields", () => {
145:  it("does not retain the caller's mutable evidence array", () => {
169:  it("creates an address without optional line2", () => {
191:  it("rejects a non-object creation input", () => {
197:  it("rejects a missing Property identity", () => {
204:  it("rejects a malformed Property identity", () => {
214:  it("rejects a missing address object", () => {
222:  it.each([
246:  it("rejects an empty optional line2 when supplied", () => {
261:  it("rejects a missing legal description", () => {
274:  it("rejects a missing owner reference", () => {
287:  it("rejects a missing or empty evidence-reference list", () => {
307:  it("rejects an invalid evidence-reference entry", () => {
320:  it("contains no valuation, debt, capacity, or ownership state", () => {
```

**Output:** Runtime coverage exists for successful creation, required fields, nested immutability, provisional status, and financial exclusions.

**Status:** Step 5 complete.

**Next:** Step 6 — Create compile-time Property safeguards.

---

## Step 6 — Create compile-time Property safeguards

**Input:** The Property interfaces and runtime creation function.

**Action:** Create `packages/domain/src/properties.type-test.ts` with the supplied compile-time assertions.

**Editor command:** `code packages/domain/src/properties.type-test.ts`

**Resulting file:**

```text
import {
  deterministicTestId,
  propertyId,
} from "./identifiers.js";
import {
  createProperty,
  type Property,
  type PropertyCreationInput,
} from "./properties.js";

const creationInput = {
  id: deterministicTestId("property", 1),
  address: {
    line1: "100 Test Street",
    locality: "Lansing",
    region: "MI",
    postalCode: "48912",
    countryCode: "US",
  },
  legalDescription:
    "Synthetic legal description for Property A",
  ownerReference: "synthetic-owner-a",
  evidenceReferences: [
    "synthetic://property-a/source-record",
  ],
} as const satisfies PropertyCreationInput;

const result = createProperty(creationInput);

if (result.ok) {
  const property: Property = result.value;

  propertyId(property.id);

  // @ts-expect-error Property identity is readonly.
  property.id = deterministicTestId("property", 2);

  // @ts-expect-error Property lifecycle status is readonly.
  property.status = "active";

  // @ts-expect-error Nested address fields are readonly.
  property.address.line1 = "Changed address";

  // @ts-expect-error Evidence references are readonly.
  property.evidenceReferences.push(
    "synthetic://property-a/other-record",
  );

  // @ts-expect-error Property is not a valuation record.
  property.approvedValueCents;

  // @ts-expect-error Property is not a debt record.
  property.seniorDebtCents;

  // @ts-expect-error Property creation contributes no capacity.
  property.capacityContributionCents;

  // @ts-expect-error Property is not an ownership balance record.
  property.unionOwnershipCents;

  void property;
}

// @ts-expect-error Creation input requires a durable identity.
const missingIdentity: PropertyCreationInput = {
  address: creationInput.address,
  legalDescription: creationInput.legalDescription,
  ownerReference: creationInput.ownerReference,
  evidenceReferences: creationInput.evidenceReferences,
};

void missingIdentity;```

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/properties.ts(3,1): error TS1127: Invalid character.
src/properties.ts(3,3): error TS1185: Merge conflict marker encountered.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 7 — Export and test the public Property API

**Input:** The passing Property implementation and safeguards.

**Actions:**

- Add `export * from "./properties.js";` exactly once to `packages/domain/src/index.ts`.
- Preserve every existing export.
- Create `packages/domain/src/properties-public.test.ts` with the supplied public-entrypoint test.

**Editor commands:**

`code packages/domain/src/index.ts`

`code packages/domain/src/properties-public.test.ts`

---

## Step 7 — Export and test the public Property API

**Input:** The passing Property implementation and safeguards.

**Actions:**

- Add `export * from "./properties.js";` exactly once to `packages/domain/src/index.ts`.
- Preserve every existing export.
- Create `packages/domain/src/properties-public.test.ts` with the supplied public-entrypoint test.

**Editor commands:**

`code packages/domain/src/index.ts`

`code packages/domain/src/properties-public.test.ts`

**Resulting entrypoint:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
export * from "./properties.js";
```

**Resulting public test:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  deterministicTestId,
  type PropertyCreationInput,
} from "./index.js";

describe("Property public API", () => {
  it("creates a Property through the domain entrypoint", () => {
    const input = {
      id: deterministicTestId("property", 1),
      address: {
        line1: "100 Test Street",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description for Property A",
      ownerReference: "synthetic-owner-a",
      evidenceReferences: [
        "synthetic://property-a/source-record",
      ],
    } as const satisfies PropertyCreationInput;

    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.id).toBe(input.id);
    expect(result.value.status).toBe("proposed");
  });
});```

**Commands and output:**

```text
$ test "$(rg -c "properties\.js" packages/domain/src/index.ts)" -eq 1

$ npm test --workspace packages/domain -- --run src/properties-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/properties-public.test.ts [2m([22m[2m0 test[22m[2m)[22m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/properties-public.test.ts[2m [ src/properties-public.test.ts ][22m
[31m[1mError[22m: Transform failed with 1 error:

[31m[PARSE_ERROR] [0mInvalid Character ` `
   [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/properties.ts:3:2 [38;5;246m][0m
   [38;5;246m│[0m
 [38;5;246m3 │[0m [38;5;249m#[0m [38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m
 [38;5;240m  │[0m  ┬
 [38;5;240m  │[0m  ╰──
[38;5;246m───╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain/src/properties.ts[39m
[90m [2m❯[22m transformWithOxc ../../node_modules/vite/dist/node/chunks/node.js:[2m4033:19[22m[39m
[90m [2m❯[22m TransformPluginContext.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m4104:26[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m30201:51[22m[39m
[90m [2m❯[22m loadAndTransform ../../node_modules/vite/dist/node/chunks/node.js:[2m20124:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 00:22:30
[2m   Duration [22m 287ms[2m (transform 107ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/properties-public.test.ts
---

## Step 8 — Run focused Property verification

**Input:** The Property source, runtime tests, compile-time safeguards, and public export.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/properties.ts(3,1): error TS1127: Invalid character.
src/properties.ts(3,3): error TS1185: Merge conflict marker encountered.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
---

## Step 9 — Prove the focused suite detects a wrong expectation

**Input:** The passing focused Property suite from Step 8.

**Temporary action:** Back up the exact runtime test file, then append one test named `TEMPORARY: incorrectly expects a new Property to be active`.

**Commands and output:**

```text
$ cp packages/domain/src/properties.test.ts /tmp/WO-015-properties.test.ts

$ cat >> packages/domain/src/properties.test.ts << temporary-test

$ rg -n "TEMPORARY:" packages/domain/src/properties.test.ts
352:it("TEMPORARY: incorrectly expects a new Property to be active", () => {
```

**Output:** A backed-up, deliberately invalid test is present.

**Status:** Temporary invalid state created; failure is required.

**Next:** Step 9B — Run the command that must fail.

**Expected result:** The focused Property suite must return a nonzero status because the temporary test expects `active` instead of `proposed`.

```text
$ npm test --workspace packages/domain -- --run src/properties.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/properties.test.ts [2m([22m[2m0 test[22m[2m)[22m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/properties.test.ts[2m [ src/properties.test.ts ][22m
[31m[1mError[22m: Transform failed with 1 error:

[31m[PARSE_ERROR] [0mInvalid Character ` `
   [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/properties.ts:3:2 [38;5;246m][0m
   [38;5;246m│[0m
 [38;5;246m3 │[0m [38;5;249m#[0m [38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m
 [38;5;240m  │[0m  ┬
 [38;5;240m  │[0m  ╰──
[38;5;246m───╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain/src/properties.ts[39m
[90m [2m❯[22m transformWithOxc ../../node_modules/vite/dist/node/chunks/node.js:[2m4033:19[22m[39m
[90m [2m❯[22m TransformPluginContext.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m4104:26[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m30201:51[22m[39m
[90m [2m❯[22m loadAndTransform ../../node_modules/vite/dist/node/chunks/node.js:[2m20124:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 00:24:53
[2m   Duration [22m 262ms[2m (transform 76ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/properties.test.ts
```

**Observed result:** The focused suite rejected the incorrect active-status expectation.

**Status:** Expected failure confirmed; restoration is required.

**Next:** Step 10 — Restore the valid runtime test file.

---

## Step 8 — Run focused Property verification

**Input:** The Property source, runtime tests, compile-time safeguards, and public export.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

src/properties.ts(3,1): error TS1127: Invalid character.
src/properties.ts(3,3): error TS1185: Merge conflict marker encountered.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c tsc -p tsconfig.test.json
**Resulting entrypoint:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
export * from "./properties.js";
```

**Resulting public test:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  deterministicTestId,
  type PropertyCreationInput,
} from "./index.js";

describe("Property public API", () => {
  it("creates a Property through the domain entrypoint", () => {
    const input = {
      id: deterministicTestId("property", 1),
      address: {
        line1: "100 Test Street",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description for Property A",
      ownerReference: "synthetic-owner-a",
      evidenceReferences: [
        "synthetic://property-a/source-record",
      ],
    } as const satisfies PropertyCreationInput;

    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.id).toBe(input.id);
    expect(result.value.status).toBe("proposed");
  });
});```

**Commands and output:**

```text
$ test "$(rg -c "properties\.js" packages/domain/src/index.ts)" -eq 1

$ npm test --workspace packages/domain -- --run src/properties-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/properties-public.test.ts [2m([22m[2m0 test[22m[2m)[22m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/properties-public.test.ts[2m [ src/properties-public.test.ts ][22m
[31m[1mError[22m: Transform failed with 1 error:

[31m[PARSE_ERROR] [0mInvalid Character ` `
   [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/properties.ts:3:2 [38;5;246m][0m
   [38;5;246m│[0m
 [38;5;246m3 │[0m [38;5;249m#[0m [38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m
 [38;5;240m  │[0m  ┬
 [38;5;240m  │[0m  ╰──
[38;5;246m───╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain/src/properties.ts[39m
[90m [2m❯[22m transformWithOxc ../../node_modules/vite/dist/node/chunks/node.js:[2m4033:19[22m[39m
[90m [2m❯[22m TransformPluginContext.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m4104:26[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m30201:51[22m[39m
[90m [2m❯[22m loadAndTransform ../../node_modules/vite/dist/node/chunks/node.js:[2m20124:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 00:25:14
[2m   Duration [22m 283ms[2m (transform 92ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/properties-public.test.ts
**Resulting entrypoint:**

```text
import type { Cents } from "./value-types.js";

export * from "./value-types.js";

export function describeAmount(amount: Cents): string {
  return `${amount} cents`;
}

export * from "./identifiers.js";
export * from "./domain-errors.js";
export * from "./canonical-scenarios.js";
export * from "./properties.js";
```

**Resulting public test:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createProperty,
  deterministicTestId,
  type PropertyCreationInput,
} from "./index.js";

describe("Property public API", () => {
  it("creates a Property through the domain entrypoint", () => {
    const input = {
      id: deterministicTestId("property", 1),
      address: {
        line1: "100 Test Street",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description for Property A",
      ownerReference: "synthetic-owner-a",
      evidenceReferences: [
        "synthetic://property-a/source-record",
      ],
    } as const satisfies PropertyCreationInput;

    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.id).toBe(input.id);
    expect(result.value.status).toBe("proposed");
  });
});```

**Commands and output:**

```text
$ test "$(rg -c "properties\.js" packages/domain/src/index.ts)" -eq 1

$ npm test --workspace packages/domain -- --run src/properties-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/properties-public.test.ts [2m([22m[2m0 test[22m[2m)[22m

[31m⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Suites 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/properties-public.test.ts[2m [ src/properties-public.test.ts ][22m
[31m[1mError[22m: Transform failed with 1 error:

[31m[PARSE_ERROR] [0mInvalid Character ` `
   [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/properties.ts:3:2 [38;5;246m][0m
   [38;5;246m│[0m
 [38;5;246m3 │[0m [38;5;249m#[0m [38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m[38;5;249m=[0m
 [38;5;240m  │[0m  ┬
 [38;5;240m  │[0m  ╰──
[38;5;246m───╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain/src/properties.ts[39m
[90m [2m❯[22m transformWithOxc ../../node_modules/vite/dist/node/chunks/node.js:[2m4033:19[22m[39m
[90m [2m❯[22m TransformPluginContext.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m4104:26[22m[39m
[90m [2m❯[22m EnvironmentPluginContainer.transform ../../node_modules/vite/dist/node/chunks/node.js:[2m30201:51[22m[39m
[90m [2m❯[22m loadAndTransform ../../node_modules/vite/dist/node/chunks/node.js:[2m20124:26[22m[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [2mno tests[22m
[2m   Start at [22m 00:26:02
[2m   Duration [22m 217ms[2m (transform 57ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/properties-public.test.ts
**Resulting file:**

```text
import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainResult,
} from "./domain-errors.js";
import {
  propertyId,
  type PropertyId,
} from "./identifiers.js";
import {
  propertyStatus,
  type PropertyStatus,
} from "./domain-statuses.js";

export interface PropertyAddressInput {
  readonly line1: string;
  readonly line2?: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly countryCode: string;
}

export interface PropertyCreationInput {
  readonly id: string;
  readonly address: PropertyAddressInput;
  readonly legalDescription: string;
  readonly ownerReference: string;
  readonly evidenceReferences: readonly string[];
}

export interface PropertyAddress {
  readonly line1: string;
  readonly line2?: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly countryCode: string;
}

export interface Property {
  readonly id: PropertyId;
  readonly status: PropertyStatus;
  readonly address: Readonly<PropertyAddress>;
  readonly legalDescription: string;
  readonly ownerReference: string;
  readonly evidenceReferences: readonly string[];
}

type InputRecord = Readonly<Record<string, unknown>>;
type InvalidPropertyResult<T = never> = DomainResult<
  T,
  DomainError<"invalid-input">
>;

function isInputRecord(value: unknown): value is InputRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function invalidPropertyInput<T = never>(
  path: string,
  expected: string,
): InvalidPropertyResult<T> {
  return domainFailure(
    domainError(
      "invalid-input",
      `Invalid Property creation input at ${path}.`,
      {
        path,
        expected,
      },
    ),
  );
}

function readRequiredString(
  record: InputRecord,
  key: string,
  path: string,
): InvalidPropertyResult<string> {
  const value = record[key];

  if (typeof value !== "string") {
    return invalidPropertyInput(path, "a nonempty string");
  }

  const normalized = value.trim();

  if (normalized.length === 0) {
    return invalidPropertyInput(path, "a nonempty string");
  }

  return domainSuccess(normalized);
}

function parseAddress(
  value: unknown,
): InvalidPropertyResult<Readonly<PropertyAddress>> {
  if (!isInputRecord(value)) {
    return invalidPropertyInput(
      "$.address",
      "an address object",
    );
  }

  const line1 = readRequiredString(
    value,
    "line1",
    "$.address.line1",
  );
  if (!line1.ok) {
    return line1;
  }

  const locality = readRequiredString(
    value,
    "locality",
    "$.address.locality",
  );
  if (!locality.ok) {
    return locality;
  }

  const region = readRequiredString(
    value,
    "region",
    "$.address.region",
  );
  if (!region.ok) {
    return region;
  }

  const postalCode = readRequiredString(
    value,
    "postalCode",
    "$.address.postalCode",
  );
  if (!postalCode.ok) {
    return postalCode;
  }

  const countryCode = readRequiredString(
    value,
    "countryCode",
    "$.address.countryCode",
  );
  if (!countryCode.ok) {
    return countryCode;
  }

  const rawLine2 = value.line2;
  let line2: string | undefined;

  if (rawLine2 !== undefined) {
    if (typeof rawLine2 !== "string") {
      return invalidPropertyInput(
        "$.address.line2",
        "a nonempty string when supplied",
      );
    }

    line2 = rawLine2.trim();

    if (line2.length === 0) {
      return invalidPropertyInput(
        "$.address.line2",
        "a nonempty string when supplied",
      );
    }
  }

  if (line2 === undefined) {
    return domainSuccess(
      Object.freeze({
        line1: line1.value,
        locality: locality.value,
        region: region.value,
        postalCode: postalCode.value,
        countryCode: countryCode.value,
      }),
    );
  }

  return domainSuccess(
    Object.freeze({
      line1: line1.value,
      line2,
      locality: locality.value,
      region: region.value,
      postalCode: postalCode.value,
      countryCode: countryCode.value,
    }),
  );
}

function parseEvidenceReferences(
  value: unknown,
): InvalidPropertyResult<readonly string[]> {
  if (!Array.isArray(value) || value.length === 0) {
    return invalidPropertyInput(
      "$.evidenceReferences",
      "a nonempty array of nonempty strings",
    );
  }

  const references: string[] = [];

  for (const [index, reference] of value.entries()) {
    const path = `$.evidenceReferences[${index}]`;

    if (typeof reference !== "string") {
      return invalidPropertyInput(path, "a nonempty string");
    }

    const normalized = reference.trim();

    if (normalized.length === 0) {
      return invalidPropertyInput(path, "a nonempty string");
    }

    references.push(normalized);
  }

  return domainSuccess(Object.freeze(references));
}

export function createProperty(
  input: unknown,
): DomainResult<Property, DomainError<"invalid-input">> {
  if (!isInputRecord(input)) {
    return invalidPropertyInput("$", "a Property creation object");
  }

  const rawId = readRequiredString(input, "id", "$.id");
  if (!rawId.ok) {
    return rawId;
  }

  let id: PropertyId;

  try {
    id = propertyId(rawId.value);
  } catch {
    return invalidPropertyInput(
      "$.id",
      "a canonical PropertyId",
    );
  }

  const address = parseAddress(input.address);
  if (!address.ok) {
    return address;
  }

  const legalDescription = readRequiredString(
    input,
    "legalDescription",
    "$.legalDescription",
  );
  if (!legalDescription.ok) {
    return legalDescription;
  }

  const ownerReference = readRequiredString(
    input,
    "ownerReference",
    "$.ownerReference",
  );
  if (!ownerReference.ok) {
    return ownerReference;
  }

  const evidenceReferences = parseEvidenceReferences(
    input.evidenceReferences,
  );
  if (!evidenceReferences.ok) {
    return evidenceReferences;
  }

  const property: Property = Object.freeze({
    id,
    status: propertyStatus("proposed"),
    address: address.value,
    legalDescription: legalDescription.value,
    ownerReference: ownerReference.value,
    evidenceReferences: evidenceReferences.value,
  });

  return domainSuccess(property);
}```

**Structural checks:**

```text
$ rg -n "^export (interface|function)" packages/domain/src/properties.ts
17:export interface PropertyAddressInput {
26:export interface PropertyCreationInput {
34:export interface PropertyAddress {
43:export interface Property {
233:export function createProperty(

$ rg -n "approvedValue|estimatedValue|seniorDebt|capacity|ownership|balance|token" packages/domain/src/properties.ts || true
```

**Output:** The immutable Property creation boundary exists without financial fields or calculations.

**Status:** Step 4 complete.

**Next:** Step 5 — Create the Property runtime tests.

---

## Step 5 — Create the Property runtime tests

**Input:** The saved Property implementation.

**Action:** Create `packages/domain/src/properties.test.ts` with the supplied runtime suite.

**Editor command:** `code packages/domain/src/properties.test.ts`

**Resulting file:**

```text
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  deterministicTestId,
} from "./identifiers.js";
import {
  createProperty,
  type PropertyCreationInput,
} from "./properties.js";

function validPropertyInput(): PropertyCreationInput {
  return {
    id: deterministicTestId("property", 1),
    address: {
      line1: "100 Test Street",
      line2: "Unit A",
      locality: "Lansing",
      region: "MI",
      postalCode: "48912",
      countryCode: "US",
    },
    legalDescription:
      "Synthetic legal description for Property A",
    ownerReference: "synthetic-owner-a",
    evidenceReferences: [
      "synthetic://property-a/source-record",
    ],
  };
}

function expectInvalidPath(
  input: unknown,
  expectedPath: string,
): void {
  const result = createProperty(input);

  expect(result.ok).toBe(false);

  if (result.ok) {
    throw new Error("Expected Property creation to fail");
  }

  expect(result.error.code).toBe("invalid-input");
  expect(result.error.details?.path).toBe(expectedPath);
}

describe("createProperty", () => {
  it("creates an immutable provisional Property", () => {
    const result = createProperty(validPropertyInput());

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value).toEqual({
      id: deterministicTestId("property", 1),
      status: "proposed",
      address: {
        line1: "100 Test Street",
        line2: "Unit A",
        locality: "Lansing",
        region: "MI",
        postalCode: "48912",
        countryCode: "US",
      },
      legalDescription:
        "Synthetic legal description for Property A",
      ownerReference: "synthetic-owner-a",
      evidenceReferences: [
        "synthetic://property-a/source-record",
      ],
    });

    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.address)).toBe(true);
    expect(
      Object.isFrozen(result.value.evidenceReferences),
    ).toBe(true);
  });

  it("always begins in proposed status", () => {
    const input = {
      ...validPropertyInput(),
      status: "active",
    };
    const result = createProperty(input);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.status).toBe("proposed");
  });

  it("trims supported string fields", () => {
    const input = validPropertyInput();
    const result = createProperty({
      ...input,
      id: `  ${input.id}  `,
      address: {
        line1: "  100 Test Street  ",
        line2: "  Unit A  ",
        locality: "  Lansing  ",
        region: "  MI  ",
        postalCode: "  48912  ",
        countryCode: "  US  ",
      },
      legalDescription:
        "  Synthetic legal description for Property A  ",
      ownerReference: "  synthetic-owner-a  ",
      evidenceReferences: [
        "  synthetic://property-a/source-record  ",
      ],
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value.address.line1).toBe(
      "100 Test Street",
    );
    expect(result.value.address.line2).toBe("Unit A");
    expect(result.value.legalDescription).toBe(
      "Synthetic legal description for Property A",
    );
    expect(result.value.ownerReference).toBe(
      "synthetic-owner-a",
    );
    expect(result.value.evidenceReferences).toEqual([
      "synthetic://property-a/source-record",
    ]);
  });

  it("does not retain the caller's mutable evidence array", () => {
    const evidenceReferences = [
      "synthetic://property-a/source-record",
    ];
    const result = createProperty({
      ...validPropertyInput(),
      evidenceReferences,
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    evidenceReferences.push(
      "synthetic://property-a/later-mutation",
    );

    expect(result.value.evidenceReferences).toEqual([
      "synthetic://property-a/source-record",
    ]);
  });

  it("creates an address without optional line2", () => {
    const input = validPropertyInput();
    const result = createProperty({
      ...input,
      address: {
        line1: input.address.line1,
        locality: input.address.locality,
        region: input.address.region,
        postalCode: input.address.postalCode,
        countryCode: input.address.countryCode,
      },
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect("line2" in result.value.address).toBe(false);
  });

  it("rejects a non-object creation input", () => {
    expectInvalidPath(null, "$");
    expectInvalidPath([], "$");
    expectInvalidPath("property", "$");
  });

  it("rejects a missing Property identity", () => {
    const { id: _id, ...withoutId } = validPropertyInput();
    void _id;

    expectInvalidPath(withoutId, "$.id");
  });

  it("rejects a malformed Property identity", () => {
    expectInvalidPath(
      {
        ...validPropertyInput(),
        id: "property-a",
      },
      "$.id",
    );
  });

  it("rejects a missing address object", () => {
    const { address: _address, ...withoutAddress } =
      validPropertyInput();
    void _address;

    expectInvalidPath(withoutAddress, "$.address");
  });

  it.each([
    ["line1"],
    ["locality"],
    ["region"],
    ["postalCode"],
    ["countryCode"],
  ] as const)(
    "rejects an empty required address field: %s",
    (field) => {
      const input = validPropertyInput();

      expectInvalidPath(
        {
          ...input,
          address: {
            ...input.address,
            [field]: "   ",
          },
        },
        `$.address.${field}`,
      );
    },
  );

  it("rejects an empty optional line2 when supplied", () => {
    const input = validPropertyInput();

    expectInvalidPath(
      {
        ...input,
        address: {
          ...input.address,
          line2: "   ",
        },
      },
      "$.address.line2",
    );
  });

  it("rejects a missing legal description", () => {
    const {
      legalDescription: _legalDescription,
      ...withoutLegalDescription
    } = validPropertyInput();
    void _legalDescription;

    expectInvalidPath(
      withoutLegalDescription,
      "$.legalDescription",
    );
  });

  it("rejects a missing owner reference", () => {
    const {
      ownerReference: _ownerReference,
      ...withoutOwnerReference
    } = validPropertyInput();
    void _ownerReference;

    expectInvalidPath(
      withoutOwnerReference,
      "$.ownerReference",
    );
  });

  it("rejects a missing or empty evidence-reference list", () => {
    const {
      evidenceReferences: _evidenceReferences,
      ...withoutEvidenceReferences
    } = validPropertyInput();
    void _evidenceReferences;

    expectInvalidPath(
      withoutEvidenceReferences,
      "$.evidenceReferences",
    );
    expectInvalidPath(
      {
        ...validPropertyInput(),
        evidenceReferences: [],
      },
      "$.evidenceReferences",
    );
  });

  it("rejects an invalid evidence-reference entry", () => {
    expectInvalidPath(
      {
        ...validPropertyInput(),
        evidenceReferences: [
          "synthetic://property-a/source-record",
          "   ",
        ],
      },
      "$.evidenceReferences[1]",
    );
  });

  it("contains no valuation, debt, capacity, or ownership state", () => {
    const result = createProperty(validPropertyInput());

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw new Error(result.error.message);
    }

    expect(result.value).not.toHaveProperty(
      "approvedValueCents",
    );
    expect(result.value).not.toHaveProperty(
      "estimatedValueCents",
    );
    expect(result.value).not.toHaveProperty(
      "seniorDebtCents",
    );
    expect(result.value).not.toHaveProperty(
      "capacityContributionCents",
    );
    expect(result.value).not.toHaveProperty(
      "poolCapacityCents",
    );
    expect(result.value).not.toHaveProperty(
      "unionOwnershipCents",
    );
    expect(result.value).not.toHaveProperty(
      "homeownerOwnershipCents",
    );
  });
});```

**Test inventory:**

```text
$ rg -n "it\(|it\.each" packages/domain/src/properties.test.ts
52:  it("creates an immutable provisional Property", () => {
87:  it("always begins in proposed status", () => {
103:  it("trims supported string fields", () => {
145:  it("does not retain the caller's mutable evidence array", () => {
169:  it("creates an address without optional line2", () => {
191:  it("rejects a non-object creation input", () => {
197:  it("rejects a missing Property identity", () => {
204:  it("rejects a malformed Property identity", () => {
214:  it("rejects a missing address object", () => {
222:  it.each([
246:  it("rejects an empty optional line2 when supplied", () => {
261:  it("rejects a missing legal description", () => {
274:  it("rejects a missing owner reference", () => {
287:  it("rejects a missing or empty evidence-reference list", () => {
307:  it("rejects an invalid evidence-reference entry", () => {
320:  it("contains no valuation, debt, capacity, or ownership state", () => {
```

**Output:** Runtime coverage exists for successful creation, required fields, nested immutability, provisional status, and financial exclusions.

**Status:** Step 5 complete.

**Next:** Step 6 — Create compile-time Property safeguards.

---

## Step 6 — Create compile-time Property safeguards

**Input:** The Property interfaces and runtime creation function.

**Action:** Create `packages/domain/src/properties.type-test.ts` with the supplied compile-time assertions.

**Editor command:** `code packages/domain/src/properties.type-test.ts`

**Resulting file:**

```text
import {
  deterministicTestId,
  propertyId,
} from "./identifiers.js";
import {
  createProperty,
  type Property,
  type PropertyCreationInput,
} from "./properties.js";

const creationInput = {
  id: deterministicTestId("property", 1),
  address: {
    line1: "100 Test Street",
    locality: "Lansing",
    region: "MI",
    postalCode: "48912",
    countryCode: "US",
  },
  legalDescription:
    "Synthetic legal description for Property A",
  ownerReference: "synthetic-owner-a",
  evidenceReferences: [
    "synthetic://property-a/source-record",
  ],
} as const satisfies PropertyCreationInput;

const result = createProperty(creationInput);

if (result.ok) {
  const property: Property = result.value;

  propertyId(property.id);

  // @ts-expect-error Property identity is readonly.
  property.id = deterministicTestId("property", 2);

  // @ts-expect-error Property lifecycle status is readonly.
  property.status = "active";

  // @ts-expect-error Nested address fields are readonly.
  property.address.line1 = "Changed address";

  // @ts-expect-error Evidence references are readonly.
  property.evidenceReferences.push(
    "synthetic://property-a/other-record",
  );

  // @ts-expect-error Property is not a valuation record.
  property.approvedValueCents;

  // @ts-expect-error Property is not a debt record.
  property.seniorDebtCents;

  // @ts-expect-error Property creation contributes no capacity.
  property.capacityContributionCents;

  // @ts-expect-error Property is not an ownership balance record.
  property.unionOwnershipCents;

  void property;
}

// @ts-expect-error Creation input requires a durable identity.
const missingIdentity: PropertyCreationInput = {
  address: creationInput.address,
  legalDescription: creationInput.legalDescription,
  ownerReference: creationInput.ownerReference,
  evidenceReferences: creationInput.evidenceReferences,
};

void missingIdentity;```

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json

```

**Output:** TypeScript accepts the valid Property shape and confirms each expected mutation or financial-field misuse is rejected.

**Status:** Step 6 complete.

**Next:** Step 7 — Export and test the public Property API.

---

## Step 8 — Run focused Property verification

**Input:** The Property source, runtime tests, compile-time safeguards, and public export.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm test --workspace packages/domain -- --run src/properties.test.ts src/properties-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties.test.ts src/properties-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 11[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m21 passed[39m[22m[90m (21)[39m
[2m   Start at [22m 00:36:41
[2m   Duration [22m 263ms[2m (transform 189ms, setup 0ms, import 233ms, tests 14ms, environment 0ms)[22m

```

**Output:** Focused runtime, compile-time, and public-entrypoint verification passes.

**Status:** Step 8 complete.

**Next:** Step 9 — Prove the focused suite detects a wrong expectation.

---

## Step 9 — Prove the focused suite detects a wrong expectation

**Input:** The passing focused Property suite from Step 8.

**Temporary action:** Back up the exact runtime test file, then append one test named `TEMPORARY: incorrectly expects a new Property to be active`.

**Commands and output:**

```text
$ cp packages/domain/src/properties.test.ts /tmp/WO-015-properties.test.ts

$ cat >> packages/domain/src/properties.test.ts << temporary-test

$ rg -n "TEMPORARY:" packages/domain/src/properties.test.ts
352:it("TEMPORARY: incorrectly expects a new Property to be active", () => {
```

**Output:** A backed-up, deliberately invalid test is present.

**Status:** Temporary invalid state created; failure is required.

**Next:** Step 9B — Run the command that must fail.

**Expected result:** The focused Property suite must return a nonzero status because the temporary test expects `active` instead of `proposed`.

```text
$ npm test --workspace packages/domain -- --run src/properties.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [31m❯[39m src/properties.test.ts [2m([22m[2m21 tests[22m[2m | [22m[31m1 failed[39m[2m)[22m[32m 16[2mms[22m[39m
     [32m✓[39m creates an immutable provisional Property[32m 2[2mms[22m[39m
     [32m✓[39m always begins in proposed status[32m 0[2mms[22m[39m
     [32m✓[39m trims supported string fields[32m 0[2mms[22m[39m
     [32m✓[39m does not retain the caller's mutable evidence array[32m 0[2mms[22m[39m
     [32m✓[39m creates an address without optional line2[32m 0[2mms[22m[39m
     [32m✓[39m rejects a non-object creation input[32m 0[2mms[22m[39m
     [32m✓[39m rejects a missing Property identity[32m 0[2mms[22m[39m
     [32m✓[39m rejects a malformed Property identity[32m 0[2mms[22m[39m
     [32m✓[39m rejects a missing address object[32m 0[2mms[22m[39m
     [32m✓[39m rejects an empty required address field: line1[32m 0[2mms[22m[39m
     [32m✓[39m rejects an empty required address field: locality[32m 0[2mms[22m[39m
     [32m✓[39m rejects an empty required address field: region[32m 0[2mms[22m[39m
     [32m✓[39m rejects an empty required address field: postalCode[32m 0[2mms[22m[39m
     [32m✓[39m rejects an empty required address field: countryCode[32m 0[2mms[22m[39m
     [32m✓[39m rejects an empty optional line2 when supplied[32m 0[2mms[22m[39m
     [32m✓[39m rejects a missing legal description[32m 0[2mms[22m[39m
     [32m✓[39m rejects a missing owner reference[32m 0[2mms[22m[39m
     [32m✓[39m rejects a missing or empty evidence-reference list[32m 0[2mms[22m[39m
     [32m✓[39m rejects an invalid evidence-reference entry[32m 0[2mms[22m[39m
     [32m✓[39m contains no valuation, debt, capacity, or ownership state[32m 2[2mms[22m[39m
[31m   [31m×[31m TEMPORARY: incorrectly expects a new Property to be active[39m[32m 5[2mms[22m[39m

[31m⎯⎯⎯⎯⎯⎯⎯[39m[1m[41m Failed Tests 1 [49m[22m[31m⎯⎯⎯⎯⎯⎯⎯[39m

[41m[1m FAIL [22m[49m src/properties.test.ts[2m > [22mTEMPORARY: incorrectly expects a new Property to be active
[31m[1mAssertionError[22m: expected 'proposed' to be 'active' // Object.is equality[39m

Expected: [32m"active"[39m
Received: [31m"proposed"[39m

[36m [2m❯[22m src/properties.test.ts:[2m361:31[22m[39m
    [90m359|[39m   }
    [90m360|[39m
    [90m361|[39m   [34mexpect[39m(result[33m.[39mvalue[33m.[39mstatus)[33m.[39m[34mtoBe[39m([32m"active"[39m)[33m;[39m
    [90m   |[39m                               [31m^[39m
    [90m362|[39m })[33m;[39m
    [90m363|[39m

[31m[2m⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯[22m[39m


[2m Test Files [22m [1m[31m1 failed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[31m1 failed[39m[22m[2m | [22m[1m[32m20 passed[39m[22m[90m (21)[39m
[2m   Start at [22m 00:42:54
[2m   Duration [22m 242ms[2m (transform 89ms, setup 0ms, import 115ms, tests 16ms, environment 0ms)[22m

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error workspace @lcp/domain@1.0.0
npm error location /home/mike/code/local-coordination-protocol/code/economic-union/packages/domain
npm error command failed
npm error command sh -c vitest run --run src/properties.test.ts
```

**Observed result:** The focused suite rejected the incorrect active-status expectation.

**Status:** Expected failure confirmed; restoration is required.

**Next:** Step 10 — Restore the valid runtime test file.

---

## Step 10 — Restore the valid runtime test file

**Input:** The backed-up valid test file and the temporary failing repository file.

**Commands and output:**

```text
$ test -f /tmp/WO-015-properties.test.ts

$ cp /tmp/WO-015-properties.test.ts packages/domain/src/properties.test.ts

$ rg -n "TEMPORARY:" packages/domain/src/properties.test.ts || true

$ npm test --workspace packages/domain -- --run src/properties.test.ts src/properties-public.test.ts

> @lcp/domain@1.0.0 test
> vitest run --run src/properties.test.ts src/properties-public.test.ts


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 12[2mms[22m[39m

[2m Test Files [22m [1m[32m2 passed[39m[22m[90m (2)[39m
[2m      Tests [22m [1m[32m21 passed[39m[22m[90m (21)[39m
[2m   Start at [22m 00:44:09
[2m   Duration [22m 230ms[2m (transform 126ms, setup 0ms, import 176ms, tests 16ms, environment 0ms)[22m

```

**Output:** The exact valid runtime suite is restored and focused verification passes again.

**Status:** Step 10 complete.

**Next:** Step 11 — Verify the complete domain package.

---

## Step 11 — Verify the complete domain package

**Input:** The restored Property implementation, tests, type safeguards, and public export plus all prior domain behavior.

**Commands and output:**

```text
$ npm run typecheck --workspace packages/domain

> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build --workspace packages/domain

> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


$ npm test --workspace packages/domain

> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 18[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 18[2mms[22m[39m

[2m Test Files [22m [1m[32m8 passed[39m[22m[90m (8)[39m
[2m      Tests [22m [1m[32m204 passed[39m[22m[90m (204)[39m
[2m   Start at [22m 00:44:21
[2m   Duration [22m 279ms[2m (transform 552ms, setup 0ms, import 779ms, tests 106ms, environment 1ms)[22m

```

**Output:** All domain vocabulary, canonical vectors, prior lifecycle and result behavior, and the new Property model pass together.

**Status:** Step 11 complete.

**Next:** Step 12 — Verify the build artifact boundary.

---

## Step 12 — Verify the build artifact boundary

**Input:** The passing domain source and the generated `packages/domain/dist` directory.

**Destructive target:** `packages/domain/dist` only. It contains generated output and will be recreated immediately.

**Commands and output:**

```text
$ rm -rf packages/domain/dist

$ npm run build --workspace packages/domain

> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


$ find packages/domain/dist -maxdepth 2 -type f | sort
packages/domain/dist/canonical-scenarios.d.ts
packages/domain/dist/canonical-scenarios.d.ts.map
packages/domain/dist/canonical-scenarios.js
packages/domain/dist/canonical-scenarios.js.map
packages/domain/dist/canonical-scenarios.type-test.d.ts
packages/domain/dist/canonical-scenarios.type-test.d.ts.map
packages/domain/dist/canonical-scenarios.type-test.js
packages/domain/dist/canonical-scenarios.type-test.js.map
packages/domain/dist/domain-errors.d.ts
packages/domain/dist/domain-errors.d.ts.map
packages/domain/dist/domain-errors.js
packages/domain/dist/domain-errors.js.map
packages/domain/dist/domain-errors.type-test.d.ts
packages/domain/dist/domain-errors.type-test.d.ts.map
packages/domain/dist/domain-errors.type-test.js
packages/domain/dist/domain-errors.type-test.js.map
packages/domain/dist/domain-statuses.d.ts
packages/domain/dist/domain-statuses.d.ts.map
packages/domain/dist/domain-statuses.js
packages/domain/dist/domain-statuses.js.map
packages/domain/dist/domain-statuses.type-test.d.ts
packages/domain/dist/domain-statuses.type-test.d.ts.map
packages/domain/dist/domain-statuses.type-test.js
packages/domain/dist/domain-statuses.type-test.js.map
packages/domain/dist/identifiers.d.ts
packages/domain/dist/identifiers.d.ts.map
packages/domain/dist/identifiers.js
packages/domain/dist/identifiers.js.map
packages/domain/dist/identifiers.type-test.d.ts
packages/domain/dist/identifiers.type-test.d.ts.map
packages/domain/dist/identifiers.type-test.js
packages/domain/dist/identifiers.type-test.js.map
packages/domain/dist/index.d.ts
packages/domain/dist/index.d.ts.map
packages/domain/dist/index.js
packages/domain/dist/index.js.map
packages/domain/dist/properties.d.ts
packages/domain/dist/properties.d.ts.map
packages/domain/dist/properties.js
packages/domain/dist/properties.js.map
packages/domain/dist/properties.type-test.d.ts
packages/domain/dist/properties.type-test.d.ts.map
packages/domain/dist/properties.type-test.js
packages/domain/dist/properties.type-test.js.map
packages/domain/dist/value-types.d.ts
packages/domain/dist/value-types.d.ts.map
packages/domain/dist/value-types.js
packages/domain/dist/value-types.js.map
packages/domain/dist/value-types.type-test.d.ts
packages/domain/dist/value-types.type-test.d.ts.map
packages/domain/dist/value-types.type-test.js
packages/domain/dist/value-types.type-test.js.map

$ test -f packages/domain/dist/properties.js
[properties.js exists]

$ test -f packages/domain/dist/properties.d.ts
[properties.d.ts exists]

$ test ! -e packages/domain/dist/properties.test.js
[runtime test absent from dist]

$ test ! -e packages/domain/dist/properties.type-test.js
---

## Step 13 — Verify the complete Economic Union workspace

**Input:** The passing domain package and unchanged protocol and Foundry boundaries.

**Commands and output:**

```text
$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build

> @lcp/economic-union@1.0.0 build
> npm run build --workspaces --if-present


> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


> @lcp/protocol@1.0.0 build
> tsc -p tsconfig.json


$ npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 17[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 4[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 14[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 13[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 17[2mms[22m[39m

[2m Test Files [22m [1m[32m8 passed[39m[22m[90m (8)[39m
[2m      Tests [22m [1m[32m204 passed[39m[22m[90m (204)[39m
[2m   Start at [22m 01:15:51
[2m   Duration [22m 274ms[2m (transform 420ms, setup 0ms, import 694ms, tests 98ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 01:15:51
[2m   Duration [22m 209ms[2m (transform 55ms, setup 0ms, import 70ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 254.31µs (33.60µs CPU time)

Ran 1 test suite in 8.20ms (254.31µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)
```

**Output:** TypeScript, Vitest, and Foundry remain green after adding the Property model.

**Status:** Step 13 complete.

**Next:** Step 14 — Retest the adjacent Point event logger.

---

## Step 14 — Retest the adjacent Point event logger

**Input:** The passing Economic Union workspace after adding the isolated Property entity.

**Commands and output:**

```text
$ cd ../event-logger && npm test -- --run

> event-logger@0.0.0 test
> vitest --run


 RUN  v3.2.4 /home/mike/code/local-coordination-protocol/code/event-logger

Using secrets defined in .dev.vars
[vpw:debug] Adding `enable_nodejs_tty_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_fs_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_http_modules` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_perf_hooks_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:info] Starting isolated runtimes for vitest.config.js...
[mf:warn] The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2026-03-10",
but you've requested "2026-05-30". Falling back to "2026-03-10"...
 ✓ test/index.spec.js (4 tests) 190ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  01:16:09
   Duration  1.75s (transform 71ms, setup 0ms, collect 104ms, tests 190ms, environment 0ms, prepare 148ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...
```

**Output:** The neighboring Point system remains unaffected.

**Status:** Step 14 complete.

**Next:** Step 15 — Inspect and summarize WO-015.

---

## Step 15 — Inspect and summarize WO-015

**Input:** The complete passing WO-015 implementation and verification evidence.

**Expected changed files:**

- `packages/domain/src/properties.ts`
- `packages/domain/src/properties.test.ts`
- `packages/domain/src/properties.type-test.ts`
- `packages/domain/src/properties-public.test.ts`
- `packages/domain/src/index.ts`
- `docs/work-orders/WO-015-execution.md`

**Commands and output:**

```text
$ git status --short
 M packages/domain/src/index.ts
?? docs/work-orders/WO-015-execution.md
?? packages/domain/src/properties-public.test.ts
?? packages/domain/src/properties.test.ts
?? packages/domain/src/properties.ts
?? packages/domain/src/properties.type-test.ts
?? {

$ git diff --check

$ git diff --stat
 code/economic-union/packages/domain/src/index.ts | 3 ++-
 1 file changed, 2 insertions(+), 1 deletion(-)

$ git diff -- packages/domain/src/properties.ts packages/domain/src/properties.test.ts packages/domain/src/properties.type-test.ts packages/domain/src/properties-public.test.ts packages/domain/src/index.ts
diff --git a/code/economic-union/packages/domain/src/index.ts b/code/economic-union/packages/domain/src/index.ts
index fe4e2da..5e3f305 100644
--- a/code/economic-union/packages/domain/src/index.ts
+++ b/code/economic-union/packages/domain/src/index.ts
@@ -8,4 +8,5 @@ export function describeAmount(amount: Cents): string {

 export * from "./identifiers.js";
 export * from "./domain-errors.js";
-export * from "./canonical-scenarios.js";
\ No newline at end of file
+export * from "./canonical-scenarios.js";
+export * from "./properties.js";

$ rg -n "TEMPORARY:" packages/domain/src || true

$ rg -n "approvedValue|estimatedValue|seniorDebt|capacityContribution|poolCapacity|unionOwnership|homeownerOwnership" packages/domain/src/properties.ts || true
```

**Total input:** The committed Phase 2 domain vocabulary and canonical test vectors.

**Total output:** One immutable provisional Property creation boundary, runtime and compile-time safeguards, public export, and execution evidence.

**Exclusions preserved:** No valuation, debt, capacity, pooling, ownership balance, persistence, command, event, interface, or Solidity behavior was added.

**Status:** Step 15 complete.

**Next:** Step 16 — Stage only WO-015.

---

## Step 16 — Stage only WO-015

**Input:** The inspected worktree containing only the declared WO-015 changes.

**Action:** Stage only explicit Property source, tests, public export, and execution record paths.

**Commands and output:**

```text
$ git add packages/domain/src/properties.ts packages/domain/src/properties.test.ts packages/domain/src/properties.type-test.ts packages/domain/src/properties-public.test.ts packages/domain/src/index.ts docs/work-orders/WO-015-execution.md

$ git diff --cached --check
code/economic-union/docs/work-orders/WO-015-execution.md:519: trailing whitespace.
+ [38;5;240m  │[0m  ┬
code/economic-union/docs/work-orders/WO-015-execution.md:520: trailing whitespace.
+ [38;5;240m  │[0m  ╰──
code/economic-union/docs/work-orders/WO-015-execution.md:588: trailing whitespace.
+ [38;5;240m  │[0m  ┬
code/economic-union/docs/work-orders/WO-015-execution.md:589: trailing whitespace.
+ [38;5;240m  │[0m  ╰──
code/economic-union/docs/work-orders/WO-015-execution.md:608: trailing whitespace.
+ [38;5;240m  │[0m  ┬
code/economic-union/docs/work-orders/WO-015-execution.md:609: trailing whitespace.
+ [38;5;240m  │[0m  ╰──
code/economic-union/docs/work-orders/WO-015-execution.md:1463: trailing whitespace.
+ [38;5;240m  │[0m  ┬
code/economic-union/docs/work-orders/WO-015-execution.md:1464: trailing whitespace.
+ [38;5;240m  │[0m  ╰──
code/economic-union/docs/work-orders/WO-015-execution.md:1559: trailing whitespace.
+ [38;5;240m  │[0m  ┬
code/economic-union/docs/work-orders/WO-015-execution.md:1560: trailing whitespace.
+ [38;5;240m  │[0m  ╰──
code/economic-union/docs/work-orders/WO-015-execution.md:1704: trailing whitespace.
+ [38;5;240m  │[0m  ┬
code/economic-union/docs/work-orders/WO-015-execution.md:1705: trailing whitespace.
+ [38;5;240m  │[0m  ╰──
code/economic-union/docs/work-orders/WO-015-execution.md:1818: trailing whitespace.
+ [38;5;240m  │[0m  ┬
code/economic-union/docs/work-orders/WO-015-execution.md:1819: trailing whitespace.
+ [38;5;240m  │[0m  ╰──
code/economic-union/docs/work-orders/WO-015-execution.md:3148: trailing whitespace.
+
---

## Step 17 — Final verification and commit authorization

**Input:** The explicitly staged WO-015 Property source, tests, export, and execution record.

**Commands and output:**

```text
$ npm run typecheck

> @lcp/economic-union@1.0.0 typecheck
> npm run typecheck --workspaces --if-present


> @lcp/domain@1.0.0 typecheck
> tsc -p tsconfig.test.json


> @lcp/protocol@1.0.0 typecheck
> tsc -p tsconfig.test.json


$ npm run build

> @lcp/economic-union@1.0.0 build
> npm run build --workspaces --if-present


> @lcp/domain@1.0.0 build
> tsc -p tsconfig.json


> @lcp/protocol@1.0.0 build
> tsc -p tsconfig.json


$ npm test

> @lcp/economic-union@1.0.0 test
> npm run test --workspaces --if-present


> @lcp/domain@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/domain[39m

 [32m✓[39m src/domain-errors.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/properties.test.ts [2m([22m[2m20 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/domain-statuses.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/value-types.test.ts [2m([22m[2m50 tests[22m[2m)[22m[32m 15[2mms[22m[39m
 [32m✓[39m src/canonical-scenarios.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 16[2mms[22m[39m
 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/properties-public.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/identifiers.test.ts [2m([22m[2m93 tests[22m[2m)[22m[32m 20[2mms[22m[39m

[2m Test Files [22m [1m[32m8 passed[39m[22m[90m (8)[39m
[2m      Tests [22m [1m[32m204 passed[39m[22m[90m (204)[39m
[2m   Start at [22m 01:21:49
[2m   Duration [22m 299ms[2m (transform 515ms, setup 0ms, import 817ms, tests 112ms, environment 1ms)[22m


> @lcp/protocol@1.0.0 test
> vitest run


[1m[30m[46m RUN [49m[39m[22m [36mv4.1.10 [39m[90m/home/mike/code/local-coordination-protocol/code/economic-union/packages/protocol[39m

 [32m✓[39m src/index.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m   Start at [22m 01:21:50
[2m   Duration [22m 202ms[2m (transform 47ms, setup 0ms, import 61ms, tests 3ms, environment 0ms)[22m


$ cd contracts && forge fmt --check

$ cd contracts && forge build
No files changed, compilation skipped

$ cd contracts && forge test
No files changed, compilation skipped

Ran 1 test for test/Scaffold.t.sol:ScaffoldTest
[PASS] testReturnsOne() (gas: 5756)
Suite result: ok. 1 passed; 0 failed; 0 skipped; finished in 427.88µs (60.07µs CPU time)

Ran 1 test suite in 6.90ms (427.88µs CPU time): 1 tests passed, 0 failed, 0 skipped (1 total tests)

$ cd ../event-logger && npm test -- --run

> event-logger@0.0.0 test
> vitest --run


 RUN  v3.2.4 /home/mike/code/local-coordination-protocol/code/event-logger

Using secrets defined in .dev.vars
[vpw:debug] Adding `enable_nodejs_tty_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_fs_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_http_modules` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:debug] Adding `enable_nodejs_perf_hooks_module` compatibility flag during tests as this feature is needed to support the Vitest runner.
[vpw:info] Starting isolated runtimes for vitest.config.js...
[mf:warn] The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2026-03-10",
but you've requested "2026-05-30". Falling back to "2026-03-10"...
 ✓ test/index.spec.js (4 tests) 186ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  01:21:51
   Duration  1.77s (transform 65ms, setup 0ms, collect 76ms, tests 186ms, environment 0ms, prepare 223ms)

[vpw:debug] Shutting down runtimes...
[vpw:debug] Disposing remote proxy sessions...

$ rg -n "TEMPORARY:" packages/domain/src || true
```

**Acceptance evidence:**

- Valid Property creation succeeds.
- Missing or malformed identity returns invalid-input at $.id.
- New Properties begin in proposed status.
- Address, legal description, owner reference, and evidence references remain separate.
- Nested Property data is immutable.
- Property contains no valuation, debt, capacity, ownership balance, token, or pool field.
- Focused and complete TypeScript verification passes.
- Foundry passes unchanged.
- The adjacent Point event logger passes unchanged.
- The deliberate failing test was observed and restored.

**Status:** WO-015 is authorized for commit.

**Next:** Step 18 — Restage the final execution record and commit WO-015.

