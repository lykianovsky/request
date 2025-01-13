export const isFalsy = (value: unknown): value is null | undefined | false =>
  !value
