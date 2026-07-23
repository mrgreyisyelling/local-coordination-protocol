import {
  addCents,
  basisPoints,
  cents,
  compareBasisPoints,
  compareCents,
  compareEventSequences,
  compareNonces,
  compareSeniorityPositions,
  eventSequence,
  nonce,
  seniorityPosition,
} from "./value-types.js";

import type {
  BasisPoints,
  Cents,
  EventSequence,
  Nonce,
  SeniorityPosition,
} from "./value-types.js";

const centsValue = cents(100);
const basisPointsValue = basisPoints(100);
const seniorityValue = seniorityPosition(1);
const eventSequenceValue = eventSequence(0);
const nonceValue = nonce(0);

const plainNumber = 1;

// Plain numbers must pass through runtime constructors.

// @ts-expect-error A plain number is not Cents.
const centsFromNumber: Cents = plainNumber;

// @ts-expect-error A plain number is not BasisPoints.
const basisPointsFromNumber: BasisPoints = plainNumber;

// @ts-expect-error A plain number is not a SeniorityPosition.
const seniorityFromNumber: SeniorityPosition =
  plainNumber;

// @ts-expect-error A plain number is not an EventSequence.
const eventSequenceFromNumber: EventSequence =
  plainNumber;

// @ts-expect-error A plain number is not a Nonce.
const nonceFromNumber: Nonce = plainNumber;

// Different branded integer concepts are not interchangeable.

// @ts-expect-error BasisPoints cannot be assigned to Cents.
const centsFromBasisPoints: Cents = basisPointsValue;

// @ts-expect-error Cents cannot be assigned to BasisPoints.
const basisPointsFromCents: BasisPoints = centsValue;

// @ts-expect-error BasisPoints are not seniority positions.
const seniorityFromBasisPoints: SeniorityPosition =
  basisPointsValue;

// @ts-expect-error Nonce is not an event sequence.
const eventSequenceFromNonce: EventSequence =
  nonceValue;

// @ts-expect-error EventSequence is not a nonce.
const nonceFromEventSequence: Nonce =
  eventSequenceValue;

// Operations accept only values with the correct brand.

// @ts-expect-error Cents addition cannot accept BasisPoints.
addCents(centsValue, basisPointsValue);

// @ts-expect-error Cents comparison cannot accept a Nonce.
compareCents(centsValue, nonceValue);

// @ts-expect-error BasisPoints comparison cannot accept Cents.
compareBasisPoints(basisPointsValue, centsValue);

compareSeniorityPositions(
  seniorityValue,
  // @ts-expect-error EventSequence is not SeniorityPosition.
  eventSequenceValue
);

compareEventSequences(
  eventSequenceValue,
  // @ts-expect-error Nonce is not EventSequence.
  nonceValue
);

compareNonces(
  nonceValue,
  // @ts-expect-error EventSequence is not Nonce.
  eventSequenceValue
);

void [
  centsFromNumber,
  basisPointsFromNumber,
  seniorityFromNumber,
  eventSequenceFromNumber,
  nonceFromNumber,
  centsFromBasisPoints,
  basisPointsFromCents,
  seniorityFromBasisPoints,
  eventSequenceFromNonce,
  nonceFromEventSequence,
];