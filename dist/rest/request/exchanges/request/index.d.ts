export type RequestExchange = (config: RequestInit) => RequestInit | Promise<RequestInit>;
export declare const GlobalRequestExchanges: Set<RequestExchange>;
