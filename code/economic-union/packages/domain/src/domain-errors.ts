export const DOMAIN_ERROR_CODE_VALUES = [
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

export type DomainErrorCode =
  (typeof DOMAIN_ERROR_CODE_VALUES)[number];

export interface DomainError<
  C extends DomainErrorCode = DomainErrorCode,
> {
  readonly code: C;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface DomainSuccess<T> {
  readonly ok: true;
  readonly value: T;
}

export interface DomainFailure<
  E extends DomainError = DomainError,
> {
  readonly ok: false;
  readonly error: E;
}

export type DomainResult<
  T,
  E extends DomainError = DomainError,
> = DomainSuccess<T> | DomainFailure<E>;

export function domainErrorCode(value: string): DomainErrorCode {
  const values = DOMAIN_ERROR_CODE_VALUES as readonly string[];

  if (!values.includes(value)) {
    throw new RangeError(`Unknown domain error code: ${value}`);
  }

  return value as DomainErrorCode;
}

export function domainError<C extends DomainErrorCode>(
  code: C,
  message: string,
  details?: Readonly<Record<string, unknown>>,
): DomainError<C> {
  const normalizedMessage = message.trim();

  if (normalizedMessage.length === 0) {
    throw new TypeError("Domain error message must not be empty");
  }

  if (details === undefined) {
    return Object.freeze({
      code,
      message: normalizedMessage,
    });
  }

  return Object.freeze({
    code,
    message: normalizedMessage,
    details: Object.freeze({ ...details }),
  });
}

export function domainSuccess<T>(value: T): DomainSuccess<T> {
  return Object.freeze({
    ok: true,
    value,
  });
}

export function domainFailure<E extends DomainError>(
  error: E,
): DomainFailure<E> {
  return Object.freeze({
    ok: false,
    error,
  });
}