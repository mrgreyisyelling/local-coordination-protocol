import { describe, expect, it } from "vitest";

import {
  cents,
  describeAmount,
} from "./index.js";

describe("domain package entrypoint", () => {
  it("describes an amount created as cents", () => {
    expect(describeAmount(cents(125))).toBe(
      "125 cents"
    );
  });
});