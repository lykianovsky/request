import {RequestExchange} from '@rest/request/exchanges/request'
import {ResponseExchange} from '@rest/request/exchanges/response'

/**
 * Выполняет последовательное выполнение массива функций обмена, передавая результат каждой функции в следующую.
 * Тип входных данных для каждой функции зависит от типа массива функций обмена.
 *
 * @template Exchange - Массив функций обмена, которые могут работать с различными типами данных.
 * @template Input - Тип входного параметра, выводимый из первого параметра первой функции в массиве.
 *
 * @param exchanges - Массив функций обмена, которые будут выполнены последовательно.
 * @param input - Входной параметр, передаваемый в функции обмена. Его тип зависит от типа массива функций.
 *
 * @returns Возвращает `Promise`, который разрешается в тот же тип данных, что был передан в `input`.
 *
 * @remarks
 * Для обработки проблемы с типами используется приведение типа `input as never`. Это нужно для того,
 * чтобы устранить ошибку компиляции, связанную с объединением типов, когда TypeScript не может
 * корректно вывести типы для переменной `input` из-за разных типов функций обмена в массиве.
 * Приведение `input` к типу `never` позволяет устранить эти проблемы на этапе компиляции.
 */
export async function executeExchanges<
  Exchange extends RequestExchange[] | ResponseExchange[],
  Input extends Parameters<Exchange[0]>[0],
>(exchanges: Exchange, input: Input): Promise<Input> {
  let result = input

  // Последовательное выполнение всех функций обмена
  for (const exchange of exchanges) {
    // Приведение типа result как never нужно для обхода проблемы с типами в TypeScript
    result = (await exchange(result as never)) as Input
  }

  return result
}
