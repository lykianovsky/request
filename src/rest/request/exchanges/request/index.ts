export type RequestExchange = (
  config: RequestInit,
) => RequestInit | Promise<RequestInit>

export const GlobalRequestExchanges = new Set<RequestExchange>()
