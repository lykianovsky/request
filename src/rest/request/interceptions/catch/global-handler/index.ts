import {type HttpStatusCode} from '@internal-types/enum/http-status-code'

type HttpStatusHandler = (
  parameters: HttpRequestParameters,
) => never | HttpRequestParameters

export type StatusHandlersMap = Partial<
  Record<HttpStatusCode, HttpStatusHandler>
>

export const GlobalErrorHandlers = new Map<HttpStatusCode, HttpStatusHandler>()
