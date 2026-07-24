# Economic Union canonical test vectors

These JSON files are portable protocol examples. They give TypeScript,
Solidity, interfaces, replay tools, and independent verifiers the same inputs
and expected results.

## Version 1

- `v1/deficient-liquidation.json` — $160 proceeds against $175 of live claims.
- `v1/exact-liquidation.json` — $175 proceeds against $175 of live claims.
- `v1/surplus-liquidation.json` — $200 proceeds against $175 of live claims.

All monetary values are integer cents. Seniority positions are one-based and
inclusive.

All three scenarios share the same history through the pre-liquidation state:

- Alice owns 7,500 cents and positions 1–7,500.
- Bob owns 7,500 cents and positions 7,501–15,000.
- Carol owns 2,500 cents and positions 15,001–17,500.

The vectors describe expected facts. They do not execute business behavior.
The reference validator is exported by `@lcp/domain` as
`validateCanonicalScenario`.

Changing required fields or their meaning requires a new versioned directory.
The surplus destination is deliberately provisional and does not establish a
final homeowner allocation policy.