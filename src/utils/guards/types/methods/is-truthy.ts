// eslint-disable-next-line unicorn/prefer-native-coercion-functions
export const isTruthy = <T>(value: T | null | undefined): value is T => {
  return Boolean(value)
}
