import {StatusHandlersMap} from '@rest/request/interceptions/catch/global-handler'
import {interceptCatch} from '@rest/request/interceptions/catch'
import {parse} from '@rest/request/parse'

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
}

/**
 * Выполняет HTTP-запрос с указанным URL и параметрами.
 *
 * @param url URL для выполнения запроса.
 * @param options Опции запроса, такие как метод, заголовки и другие параметры.
 * @param errorHandlers Маппинг обработчиков ошибок для различных HTTP-статусных кодов.
 *
 * @returns Промис, который разрешается в параметры запроса.
 *
 * @example
 * // Пример использования с кастомными обработчиками ошибок
 * import { request } from '@rest/request';
 * import { GlobalErrorHandlers } from '@rest/request/interceptions/catch/global-handler';
 * import { HttpStatusCode } from '@internal-types/enum/http-status-code';
 *
 * // Кастомный обработчик для 404 ошибки
 * const custom404Handler = (parameters: HttpRequestParameters) => {
 *   const [response] = parameters;
 *   console.error('Ошибка 404: Ресурс не найден', response);
 *   return Promise.resolve([response, null] as const); // Возвращаем параметры с ошибкой или null
 * };
 *
 * // Регистрация кастомного обработчика для 404 ошибки
 * GlobalErrorHandlers.set(HttpStatusCode.NOT_FOUND, custom404Handler);
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
