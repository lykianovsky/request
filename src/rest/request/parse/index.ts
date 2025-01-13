enum HttpContentType {
  HTML = 'text/html',
  PLAIN = 'text/plain',
  JSON = 'application/json',
  PDF = 'application/pdf',
}

type ResponseMethods = keyof Pick<Response, 'text' | 'blob' | 'json'>

const CONTENT_TYPE_METHODS: Record<HttpContentType, {method: ResponseMethods}> =
  {
    [HttpContentType.HTML]: {
      method: 'text',
    },
    [HttpContentType.PLAIN]: {
      method: 'text',
    },
    [HttpContentType.JSON]: {
      method: 'json',
    },
    [HttpContentType.PDF]: {
      method: 'blob',
    },
  }

const getContentType = (response: Response): HttpContentType | null => {
  const contentType = response.headers.get('content-type')?.split(';')[0]

  if (!contentType) {
    return null
  }

  return contentType as HttpContentType
}

export const parse = async (response: Response) => {
  const contentType = getContentType(response)

  if (!contentType) {
    return Promise.resolve([response, undefined] as const)
  }

  const {method} = CONTENT_TYPE_METHODS[contentType]

  const clone = response.clone()

  return clone[method]().then((value) => [clone, value] as const)
}
