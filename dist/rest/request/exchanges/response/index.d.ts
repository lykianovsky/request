export type ResponseExchange = (response: HttpRequestParameters) => HttpRequestParameters | Promise<HttpRequestParameters>;
export declare const GlobalResponseExchanges: Set<ResponseExchange>;
