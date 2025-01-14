import {isResponse} from '@utils/guards/types'
import {type HttpStatusCode} from '@internal-types/enum/http-status-code'
import {
  GlobalErrorHandlers,
  type StatusHandlersMap,
} from '@rest/request/interceptions/catch/global-handler'

/**
 * Функция для перехвата и обработки ошибок, связанных с HTTP-запросами.
 * В зависимости от статуса ответа она либо вызывает кастомный обработчик ошибки,
 * либо глобальный обработчик, если кастомный не был найден.
 *
 * @param parameters Параметры запроса, которые могут содержать информацию об ошибке.
 * @param handlers Необязательный объект с кастомными обработчиками для различных статусных кодов.
 * Если обработчик для конкретного статус-кода найден, он будет вызван.
 * @throws - В случае ошибки будет вызван один из обработчиков — либо кастомный, либо глобальный.
 * Если обработчик не найден, выбрасываются сами параметры запроса.
 */
export const interceptCatch = (
  parameters: HttpRequestParameters,
  handlers?: StatusHandlersMap,
) => {
  // Проверяем, является ли параметр ответом (response)
  if (isResponse(parameters)) {
    const [response] = parameters
    const responseStatus = response.status as HttpStatusCode

    // Проверяем наличие кастомного обработчика для данного статусного кода
    const customHandler = handlers?.[responseStatus]

    if (customHandler) {
      // Если кастомный обработчик найден, вызываем его
      throw customHandler(parameters)
    }

    // Если кастомного обработчика нет, пытаемся найти глобальный обработчик
    const globalHandler = GlobalErrorHandlers.get(responseStatus)

    if (globalHandler) {
      // Если глобальный обработчик найден, вызываем его
      throw globalHandler(parameters)
    }
  }

  // Если параметр не является ответом, выбрасываем его как ошибку
  throw parameters
}
