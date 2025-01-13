import {parse} from '@rest/request/parse'
import {interceptCatch} from '@rest/request/interceptions/catch'
import {StatusHandlersMap} from '@rest/request/interceptions/catch/global-handler'

const decide = (parameters: HttpRequestParameters) => {
  const [response] = parameters

  if (response.ok) {
    return parameters
  }

  throw parameters
}

type RequestArguments = {
  url: URL
  options?: RequestInit
  errorHandlers?: StatusHandlersMap
}

export const request = <T>({
  url,
  options,
  errorHandlers,
}: RequestArguments): Promise<HttpRequestParameters<T>> =>
  fetch(url, options)
    .then(parse)
    .then(decide)
    .catch((error: HttpRequestParameters) =>
      interceptCatch(error, errorHandlers),
    )
