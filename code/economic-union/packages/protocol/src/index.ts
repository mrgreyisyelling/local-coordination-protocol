export interface CommandEnvelope<
  Type extends string,
  Payload
> {
  readonly type: Type;
  readonly payload: Payload;
}

export function createCommand<Type extends string, Payload>(
  type: Type,
  payload: Payload
): CommandEnvelope<Type, Payload> {
  return {
    type,
    payload
  };
}

