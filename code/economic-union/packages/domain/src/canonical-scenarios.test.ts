import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  CANONICAL_SCENARIO_SCHEMA_VERSION,
  validateCanonicalScenario,
  type CanonicalScenarioV1,
} from "./canonical-scenarios.js";

const loadJson = (name: string): unknown =>
  JSON.parse(
    readFileSync(
      new URL(`../../../test-vectors/v1/${name}`, import.meta.url),
      "utf8",
    ),
  ) as unknown;

const clone = (value: unknown): Record<string, unknown> =>
  JSON.parse(JSON.stringify(value)) as Record<string, unknown>;

const deficient = loadJson("deficient-liquidation.json");
const exact = loadJson("exact-liquidation.json");
const surplus = loadJson("surplus-liquidation.json");

const requireScenario = (value: unknown): CanonicalScenarioV1 => {
  const result = validateCanonicalScenario(value);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error("canonical fixture must validate");
  return result.value;
};

const requireInvalidPath = (value: unknown, path: string): void => {
  const result = validateCanonicalScenario(value);
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("mutated fixture must be rejected");
  expect(result.error.code).toBe("invalid-input");
  expect(result.error.details?.path).toBe(path);
};

describe("canonical scenario fixtures", () => {
  it.each([
    ["deficient", deficient],
    ["exact", exact],
    ["surplus", surplus],
  ])("validates the %s version-1 vector", (_name, fixture) => {
    const scenario = requireScenario(fixture);
    expect(scenario.schemaVersion).toBe(CANONICAL_SCENARIO_SCHEMA_VERSION);
    expect(scenario.actions.map((action) => action.sequence)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it("records the shared property capacity calculation", () => {
    for (const fixture of [deficient, exact, surplus]) {
      const scenario = requireScenario(fixture);
      expect(
        scenario.inputs.properties.map(
          (property) => property.expectedCapacityContributionCents,
        ),
      ).toEqual([20_000_000, 13_000_000]);
      expect(scenario.expected.pooledCapacityCents).toBe(33_000_000);
    }
  });

  it("records the same pre-liquidation balances and intervals", () => {
    for (const fixture of [deficient, exact, surplus]) {
      const scenario = requireScenario(fixture);
      expect(scenario.expected.preLiquidationBalances).toEqual([
        { memberId: "member-alice", amountCents: 7_500 },
        { memberId: "member-bob", amountCents: 7_500 },
        { memberId: "member-carol", amountCents: 2_500 },
      ]);
      expect(scenario.expected.preLiquidationIntervals).toEqual([
        { memberId: "member-alice", start: 1, end: 7_500, status: "live" },
        { memberId: "member-bob", start: 7_501, end: 15_000, status: "live" },
        { memberId: "member-carol", start: 15_001, end: 17_500, status: "live" },
      ]);
      expect(scenario.expected.issuedSupplyCents).toBe(17_500);
      expect(scenario.expected.liveSupplyBeforeLiquidationCents).toBe(17_500);
    }
  });

  it("records the deficient result exactly", () => {
    const scenario = requireScenario(deficient);
    expect(scenario.expected.liquidation.proceedsCents).toBe(16_000);
    expect(scenario.expected.liquidation.tokenDistributions).toEqual([
      {
        destinationId: "member-alice",
        destinationType: "member",
        amountCents: 7_500,
      },
      {
        destinationId: "member-bob",
        destinationType: "member",
        amountCents: 7_500,
      },
      {
        destinationId: "member-carol",
        destinationType: "member",
        amountCents: 1_000,
      },
    ]);
    expect(scenario.expected.liquidation.terminatedClaimsCents).toBe(1_500);
    expect(scenario.expected.liquidation.terminatedIntervals).toEqual([
      {
        memberId: "member-carol",
        start: 16_001,
        end: 17_500,
        status: "terminated",
      },
    ]);
  });

  it("records exact payment with no deficiency or surplus", () => {
    const scenario = requireScenario(exact);
    expect(scenario.expected.liquidation.proceedsCents).toBe(17_500);
    expect(scenario.expected.liquidation.terminatedClaimsCents).toBe(0);
    expect(scenario.expected.liquidation.terminatedIntervals).toEqual([]);
    expect(scenario.expected.liquidation.homeownerSurplus).toEqual([]);
  });

  it("caps token distributions and isolates homeowner surplus", () => {
    const scenario = requireScenario(surplus);
    const tokenTotal =
      scenario.expected.liquidation.tokenDistributions.reduce(
        (sum, distribution) => sum + distribution.amountCents,
        0,
      );
    expect(scenario.expected.liquidation.proceedsCents).toBe(20_000);
    expect(tokenTotal).toBe(17_500);
    expect(scenario.expected.liquidation.homeownerSurplus).toEqual([
      {
        destinationId: "homeowner-surplus-pool",
        destinationType: "homeowner-surplus-pool",
        amountCents: 2_500,
      },
    ]);
  });
});

describe("canonical scenario validation failures", () => {
  it("rejects an unsupported schema version with a stable code and path", () => {
    const mutated = clone(deficient);
    mutated.schemaVersion = 2;
    requireInvalidPath(mutated, "$.schemaVersion");
  });

  it("rejects fractional cents", () => {
    const mutated = clone(deficient);
    const expected = mutated.expected as Record<string, unknown>;
    expected.issuedSupplyCents = 17_500.5;
    requireInvalidPath(mutated, "$.expected.issuedSupplyCents");
  });

  it("rejects a missing required array", () => {
    const mutated = clone(deficient);
    const inputs = mutated.inputs as Record<string, unknown>;
    delete inputs.members;
    requireInvalidPath(mutated, "$.inputs.members");
  });

  it("rejects an out-of-order action sequence", () => {
    const mutated = clone(deficient);
    const actions = mutated.actions as Record<string, unknown>[];
    if (actions[2] === undefined) throw new Error("fixture action missing");
    actions[2].sequence = 9;
    requireInvalidPath(mutated, "$.actions[2].sequence");
  });

  it("rejects an inverted seniority interval", () => {
    const mutated = clone(deficient);
    const expected = mutated.expected as Record<string, unknown>;
    const intervals =
      expected.preLiquidationIntervals as Record<string, unknown>[];
    if (intervals[0] === undefined) throw new Error("fixture interval missing");
    intervals[0].end = 0;
    requireInvalidPath(mutated, "$.expected.preLiquidationIntervals[0].end");
  });

  it("rejects an unknown action type", () => {
    const mutated = clone(deficient);
    const actions = mutated.actions as Record<string, unknown>[];
    if (actions[0] === undefined) throw new Error("fixture action missing");
    actions[0].type = "invented-action";
    requireInvalidPath(mutated, "$.actions[0].type");
  });

  it("rejects a malformed invariant identifier", () => {
    const mutated = clone(deficient);
    const checks = mutated.invariantChecks as Record<string, unknown>[];
    if (checks[0] === undefined) throw new Error("fixture check missing");
    checks[0].invariantId = "capacity-is-fine";
    requireInvalidPath(mutated, "$.invariantChecks[0].invariantId");
  });
});