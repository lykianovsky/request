import {type HttpStatusCode} from '@internal-types/enum/http-status-code'

/**
 * Тип, представляющий обработчик ошибок для конкретного HTTP-запроса.
 * Принимает параметры запроса и либо обрабатывает их, либо выбрасывает ошибку.
 *
 * @param parameters Параметры запроса, которые могут содержать ошибку.
 * @returns Если обработчик не выбрасывает ошибку, возвращает обработанные параметры запроса.
 * Если выбрасывает ошибку, возвращает `never`.
 */
type HttpStatusHandler = (
  parameters: HttpRequestParameters,
) => never | HttpRequestParameters

/**
 * Тип, представляющий маппинг HTTP-статусных кодов на обработчики ошибок.
 * Статусные коды могут быть частично определены для разных типов ответов.
 */
export type StatusHandlersMap = Partial<
  Record<HttpStatusCode, HttpStatusHandler>
>

/**
 * Глобальные обработчики ошибок для различных HTTP-статусных кодов.
 * Это глобальная коллекция обработчиков ошибок, которые могут быть использованы,
 * если для конкретного кода статуса не определен кастомный обработчик.
 *
 * @example
 *
 * // Если хотите просто выводить, или пропускать ошибку, можно так
 * GlobalErrorHandlers.set(HttpStatusCode.INTERNAL_SERVER_ERROR, (parameters) => {
 *   const [response] = parameters;
 *   console.error('Ошибка 500: Внутренняя ошибка сервера', response);
 *   return parameters;
 * });
 *
 * // Регистрация своей обработки ошибки, и её вывода
 * GlobalErrorHandlers.set(HttpStatusCode.INTERNAL_SERVER_ERROR, (parameters) => {
 *   const [response] = parameters;
 *   console.error('Ошибка 500: Внутренняя ошибка сервера', response);
 *   throw new Error('Внутренняя ошибка сервера');
 * });
 */
export const GlobalErrorHandlers = new Map<HttpStatusCode, HttpStatusHandler>()
