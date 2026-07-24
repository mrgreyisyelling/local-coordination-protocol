import {
  validateCanonicalScenario,
  type CanonicalActionV1,
  type CanonicalScenarioV1,
} from "./canonical-scenarios.js";

declare const scenario: CanonicalScenarioV1;

const version: 1 = scenario.schemaVersion;
const action: CanonicalActionV1 | undefined = scenario.actions[0];
const result = validateCanonicalScenario({});

if (result.ok) {
  const validated: CanonicalScenarioV1 = result.value;
  void validated;
} else {
  const code: "invalid-input" = result.error.code;
  void code;
}

// @ts-expect-error — schema version 2 requires a future scenario type.
const unsupportedVersion: 2 = scenario.schemaVersion;

// @ts-expect-error — the scenario identity is readonly.
scenario.scenarioId = "replacement";

// @ts-expect-error — action collections are readonly.
scenario.actions.push(action);

// @ts-expect-error — money must not become a display string.
const displayMoney: string = scenario.expected.issuedSupplyCents;

// @ts-expect-error — a known success has no error branch.
if (result.ok) result.error;

// @ts-expect-error — a known failure has no value branch.
if (!result.ok) result.value;

void version;
void unsupportedVersion;
void displayMoney;