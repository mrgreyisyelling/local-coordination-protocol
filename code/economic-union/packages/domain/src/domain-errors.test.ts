import {
  describe,
  expect,
  it,
} from "vitest";

import {
  DOMAIN_ERROR_CODE_VALUES,
  domainError,
  domainErrorCode,
  domainFailure,
  domainSuccess,
  type DomainResult,
} from "./domain-errors.js";

const EXPECTED_CODES = [
  "invalid-input",
  "not-found",
  "already-exists",
  "invalid-status-transition",
  "ineligible-membership",
  "unauthorized",
  "duplicate-command",
  "duplicate-payment",
  "nonce-conflict",
  "expired-command",
  "pool-unavailable",
  "insufficient-capacity",
  "insufficient-balance",
  "invalid-interval",
  "ownership-conflict",
  "liquidation-frozen",
  "sale-incomplete",
  "already-processed",
] as const;

describe("domain error codes", () => {
  it("contains exactly the declared stable vocabulary", () => {
    expect(DOMAIN_ERROR_CODE_VALUES).toEqual(EXPECTED_CODES);
    expect(new Set(DOMAIN_ERROR_CODE_VALUES).size).toBe(
      DOMAIN_ERROR_CODE_VALUES.length,
    );
  });

  it("accepts every declared code at the runtime boundary", () => {
    for (const code of EXPECTED_CODES) {
      expect(domainErrorCode(code)).toBe(code);
    }
  });

  it("rejects unknown, empty, and incorrectly cased codes", () => {
    expect(() => domainErrorCode("")).toThrow(RangeError);
    expect(() => domainErrorCode("unknown")).toThrow(RangeError);
    expect(() =>
      domainErrorCode("INSUFFICIENT-BALANCE"),
    ).toThrow(RangeError);
  });
});

describe("domain errors", () => {
  it("preserves a stable code and structured details", () => {
    const error = domainError(
      "insufficient-balance",
      "The account does not hold enough claim value.",
      {
        requestedCents: 500,
        availableCents: 300,
      },
    );

    expect(error.code).toBe("insufficient-balance");
    expect(error.message.length).toBeGreaterThan(0);
    expect(error.details).toEqual({
      requestedCents: 500,
      availableCents: 300,
    });
  });

  it("normalizes surrounding message whitespace", () => {
    const error = domainError(
      "ineligible-membership",
      "  The member is not eligible.  ",
    );

    expect(error.code).toBe("ineligible-membership");
    expect(error.message).toBe("The member is not eligible.");
  });

  it("rejects an empty human-readable message as programmer error", () => {
    expect(() =>
      domainError("invalid-input", ""),
    ).toThrow(TypeError);
    expect(() =>
      domainError("invalid-input", "   "),
    ).toThrow(TypeError);
  });
});

describe("domain results", () => {
  it("creates a success envelope", () => {
    const result = domainSuccess({ acceptedCents: 250 });

    expect(result).toEqual({
      ok: true,
      value: { acceptedCents: 250 },
    });
  });

  it("creates a failure envelope", () => {
    const error = domainError(
      "insufficient-capacity",
      "The pool lacks enough unused capacity.",
    );
    const result = domainFailure(error);

    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("insufficient-capacity");
  });

  it("narrows success and failure by the ok discriminant", () => {
    function describe(
      result: DomainResult<number>,
    ): string {
      if (result.ok) {
        return `accepted:${result.value}`;
      }

      return `rejected:${result.error.code}`;
    }

    expect(describe(domainSuccess(25))).toBe("accepted:25");
    expect(
      describe(
        domainFailure(
          domainError(
            "insufficient-balance",
            "The account lacks enough value.",
          ),
        ),
      ),
    ).toBe("rejected:insufficient-balance");
  });

  it("represents an expected rejection without throwing", () => {
    function evaluateBalance(
      available: number,
      requested: number,
    ): DomainResult<number> {
      if (requested > available) {
        return domainFailure(
          domainError(
            "insufficient-balance",
            "The account lacks enough value.",
            { available, requested },
          ),
        );
      }

      return domainSuccess(available - requested);
    }

    expect(() => evaluateBalance(30, 40)).not.toThrow();

    const result = evaluateBalance(30, 40);
    expect(result.ok).toBe(false);

    if (!result.ok) {
      expect(result.error.code).toBe("insufficient-balance");
    }
  });
});
