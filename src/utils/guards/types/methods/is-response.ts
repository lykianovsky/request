export const isResponse = (value: unknown): value is number =>
  Array.isArray(value) && value[0] instanceof Response
