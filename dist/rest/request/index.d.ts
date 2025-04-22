import { StatusHandlersMap } from './interceptions/catch/global-handler';
import { RequestExchange } from './exchanges/request';
import { ResponseExchange } from './exchanges/response';
/**
 * Тип для аргументов запроса.
 */
type RequestArguments = {
    /** URL для запроса */
    url: URL;
    /** Опции запроса, которые могут включать заголовки, метод и другие параметры */
    options?: RequestInit;
    /** Маппинг обработчиков ошибок по статусу, которые будут вызваны при ошибке */
    errorHandlers?: StatusHandlersMap;
    exchanges?: {
        request?: RequestExchange[];
        response?: ResponseExchange[];
    };
};
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
export declare function request<T>({ url, options, exchanges, errorHandlers, }: RequestArguments): Promise<HttpRequestParameters<T>>;
export {};
