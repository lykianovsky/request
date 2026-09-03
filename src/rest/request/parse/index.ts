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
  /* Календарь */
  CALENDAR = 'text/calendar',
  EXECEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  /** CSV-файл */
  CSV = 'text/csv',
}

/**
 * Типы методов, доступных у объекта Response для различных типов контента.
 */
export type ResponseMethods = keyof Pick<Response, 'text' | 'blob' | 'json'>

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
    [HttpContentType.CALENDAR]: {
      method: 'blob',
    },
    [HttpContentType.EXECEL]: {
      method: 'blob',
    },
    [HttpContentType.CSV]: {
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
 * @param responseParsingMethod Метод, которым нужно распарсить ответ (`text`, `json`, `blob`).
 *  Если указан, используется он, независимо от заголовка `content-type`.
 * @returns Промис, который разрешается в массив с клонированным ответом и обработанным значением.
 */
export const parse = async (
  response: Response,
  responseParsingMethod?: ResponseMethods,
): Promise<[Response, any]> => {
  const method = responseParsingMethod ?? resolveMethodByContentType(response)

  if (!method) {
    return Promise.resolve([response, undefined] as const)
  }

  const clone = response.clone()

  return clone[method]().then((value) => [clone, value] as const)
}

/**
 * Определяет метод парсинга ответа по заголовку `content-type`.
 *
 * @param response Ответ от сервера.
 * @returns Метод для парсинга, либо `null`, если тип контента не распознан.
 */
const resolveMethodByContentType = (
  response: Response,
): ResponseMethods | null => {
  const contentType = getContentType(response)

  if (!contentType) {
    return null
  }

  return CONTENT_TYPE_METHODS[contentType]?.method ?? null
}
