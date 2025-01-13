import {isResponse} from '@utils/guards/types'
import {type HttpStatusCode} from '@internal-types/enum/http-status-code'
import {
  GlobalErrorHandlers,
  type StatusHandlersMap,
} from '@rest/request/interceptions/catch/global-handler'

export const interceptCatch = (
  parameters: HttpRequestParameters,
  handlers?: StatusHandlersMap,
) => {
  if (isResponse(parameters)) {
    const [response] = parameters
    const responseStatus = response.status as HttpStatusCode

    const customHandler = handlers?.[responseStatus]

    if (customHandler) {
      throw customHandler(parameters)
    }

    const globalHandler = GlobalErrorHandlers.get(responseStatus)

    if (globalHandler) {
      throw globalHandler(parameters)
    }
  }

  throw parameters
}
