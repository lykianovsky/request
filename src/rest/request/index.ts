import {StatusHandlersMap} from '@rest/request/interceptions/catch/global-handler'
import {interceptCatch} from '@rest/request/interceptions/catch'
import {parse} from '@rest/request/parse'
import {executeExchanges} from '@rest/request/exchanges'
import {RequestExchange} from '@rest/request/exchanges/request'
import {ResponseExchange} from '@rest/request/exchanges/response'

/**
 * Функция для принятия решения о дальнейшей обработке запроса на основе его статуса.
 * Если ответ успешный, возвращаются переданные параметры. В противном случае выбрасывается исключение с параметрами запроса.
 *
 * @param parameters Параметры запроса, содержащие информацию об ответе.
 * @returns Возвращает параметры запроса, если ответ успешный.
 * @throws {HttpRequestParameters} Выбрасывает параметры запроса, если ответ не успешный.
 */
const decide = (parameters: HttpRequestParameters) => {
  const [response] = parameters

  if (response.ok) {
    return parameters
  }

  throw parameters
}

/**
 * Тип для аргументов запроса.
 */
type RequestArguments = {
  /** URL для запроса */
  url: URL
  /** Опции запроса, которые могут включать заголовки, метод и другие параметры */
  options?: RequestInit
  /** Маппинг обработчиков ошибок по статусу, которые будут вызваны при ошибке */
  errorHandlers?: StatusHandlersMap
  exchanges?: {
    request?: RequestExchange[]
    response?: ResponseExchange[]
  }
}

/**
 * Выполняет HTTP-запрос с указанным URL и параметрами.
 *
 * @param url URL для выполнения запроса.
 * @param options Опции запроса, такие как метод, заголовки и другие параметры.
 * @param errorHandlers Маппинг обработчиков ошибок для различных HTTP-статусных кодов.
 * @param exchanges Маппинг обработчиков, которые будут изменять данные RequestInit (перед выполнением) либо Response (после выполнения)
 *
 * @returns Промис, который разрешается в параметры запроса.
 *
 * @example
 * // Пример использования с кастомными обработчиками ошибок
 * import { request } from '@rest/request';
 * import { GlobalErrorHandlers } from '@rest/request/interceptions/catch/global-handler';
 * import { HttpStatusCode } from '@internal-types/enum/http-status-code';
 *
 *
 * // Запрос, который может вернуть ошибку 404
 * const fetchData = async () => {
 *   const url = 'https://example.com/non-existent-endpoint';
 *
 *   try {
 *     const response = await request({
 *       url: new URL(url),
 *       options: { method: 'GET' },
 *     });
 *
 *     // Обрабатываем успешный ответ
 *     const [data] = response;
 *     console.log('Ответ получен:', data);
 *   } catch (error: Error) {
 *     // Перехват ошибки
 *     console.error('Произошла ошибка при выполнении запроса:', error);
 *   }
 * };
 *
 * // Вызов функции для выполнения запроса
 * fetchData();
 *
 */
export async function request<T>({
  url,
  options,
  exchanges,
  errorHandlers,
}: RequestArguments): Promise<HttpRequestParameters<T>> {
  let cloneOptions = {...options}

  if (cloneOptions && exchanges?.request) {
    cloneOptions = await executeExchanges(exchanges.request, cloneOptions)
  }

  return fetch(url, cloneOptions)
    .then(parse)
    .then(decide)
    .then(async (response) => {
      if (exchanges?.response) {
        return await executeExchanges(exchanges.response, response)
      }

      return response
    })
    .catch((error: HttpRequestParameters) =>
      interceptCatch(error, errorHandlers),
    )
}
