import {
  domainError,
  domainFailure,
  domainSuccess,
  type DomainError,
  type DomainErrorCode,
  type DomainResult,
} from "./domain-errors.js";

const code: DomainErrorCode = "insufficient-balance";
const specificError: DomainError<"insufficient-balance"> =
  domainError(
    "insufficient-balance",
    "The account lacks enough value.",
  );
const success: DomainResult<number> = domainSuccess(10);
const failure: DomainResult<number> =
  domainFailure(specificError);

function consume(result: DomainResult<number>): number {
  if (result.ok) {
    return result.value;
  }

  return result.error.code.length;
}

// @ts-expect-error Unknown strings are not stable DomainErrorCode values.
const unknownCode: DomainErrorCode = "something-broke";

// @ts-expect-error domainError accepts only declared stable codes.
domainError("something-broke", "Unknown failure.");

// @ts-expect-error A success branch does not contain an error.
success.error;

// @ts-expect-error A failure branch does not contain a value.
failure.value;

// @ts-expect-error Result discriminants are readonly.
success.ok = false;

// @ts-expect-error Success values are readonly.
success.value = 20;

// @ts-expect-error Error codes are readonly.
specificError.code = "invalid-input";

void code;
void unknownCode;
void consume(success);
void consume(failure);