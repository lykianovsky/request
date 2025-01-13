import { StatusHandlersMap } from './interceptions/catch/global-handler';
type RequestArguments = {
    url: URL;
    options?: RequestInit;
    errorHandlers?: StatusHandlersMap;
};
export declare const request: <T>({ url, options, errorHandlers, }: RequestArguments) => Promise<HttpRequestParameters<T>>;
export {};
