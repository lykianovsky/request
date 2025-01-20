export type ResponseExchange = (
  response: HttpRequestParameters,
) => HttpRequestParameters | Promise<HttpRequestParameters>

export const GlobalResponseExchanges = new Set<ResponseExchange>()
