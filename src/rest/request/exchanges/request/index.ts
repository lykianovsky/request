export type RequestExchange = (
  config: RequestInit,
) => RequestInit | Promise<RequestInit>
