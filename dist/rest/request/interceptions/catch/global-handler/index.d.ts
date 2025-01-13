import { HttpStatusCode } from '../../../../../types/enum/http-status-code';
type HttpStatusHandler = (parameters: HttpRequestParameters) => never | HttpRequestParameters;
export type StatusHandlersMap = Partial<Record<HttpStatusCode, HttpStatusHandler>>;
export declare const GlobalErrorHandlers: Map<HttpStatusCode, HttpStatusHandler>;
export {};
