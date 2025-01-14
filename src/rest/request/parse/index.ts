/**
 * Перечисление типов контента, которые могут быть возвращены сервером.
 */
enum HttpContentType {
  /** HTML-контент */
  HTML = 'text/html',
  /** Простой текст */
  PLAIN = 'text/plain',
  /** JSON-контент */
  JSON = 'application/json',
  /** PDF-контент */
  PDF = 'application/pdf',
}

/**
 * Типы методов, доступных у объекта Response для различных типов контента.
 */
type ResponseMethods = keyof Pick<Response, 'text' | 'blob' | 'json'>

/**
 * Маппинг типов контента на соответствующие методы объекта Response.
 * Для каждого типа контента указан метод, который будет вызван для обработки ответа.
 */
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

/**
 * Функция для получения типа контента из заголовков ответа.
 * Извлекает значение `content-type` и возвращает его в виде одного из значений перечисления `HttpContentType`.
 *
 * @param response Ответ от сервера.
 * @returns Возвращает тип контента из заголовков, либо `null`, если тип не найден.
 */
const getContentType = (response: Response): HttpContentType | null => {
  const contentType = response.headers.get('content-type')?.split(';')[0]

  if (!contentType) {
    return null
  }

  return contentType as HttpContentType
}

/**
 * Парсит тело ответа на основе его типа контента.
 * В зависимости от типа контента выполняет вызов метода `text()`, `json()` или `blob()` на объекте Response.
 *
 * @param response Ответ от сервера.
 * @returns Промис, который разрешается в массив с клонированным ответом и обработанным значением.
 */
export const parse = async (response: Response): Promise<[Response, any]> => {
  const contentType = getContentType(response)

  if (!contentType) {
    return Promise.resolve([response, undefined] as const)
  }

  const {method} = CONTENT_TYPE_METHODS[contentType]

  const clone = response.clone()

  return clone[method]().then((value) => [clone, value] as const)
}
