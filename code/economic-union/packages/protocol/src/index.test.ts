import {
  describe,
  expect,
  it
} from "vitest";

import {
  createCommand
} from "./index.js";

describe("createCommand", () => {
  it("preserves the command type and payload", () => {
    const command = createCommand(
      "member.register",
      {
        memberId: "member-001"
      }
    );

    expect(command).toEqual({
      type: "member.register",
      payload: {
        memberId: "member-001"
      }
    });
  });
});