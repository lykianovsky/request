import {request} from '@rest/request/index'
import {RequestExchange} from '@rest/request/exchanges/request'
import {ResponseExchange} from '@rest/request/exchanges/response'

global.fetch = jest.fn()

const MOCK_URL = new URL('https://example.com/api')

describe('request', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles successful response', async () => {
    const mockBody = {data: 'success'}

    const mockResponse = new Response(JSON.stringify(mockBody), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    })

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const [response, result] = await request({
      url: MOCK_URL,
      options: {method: 'GET'},
    })

    expect(fetch).toHaveBeenCalledWith(MOCK_URL, {
      method: 'GET',
    })
    expect(response.ok).toBe(true) // Проверяем ключевые свойства ответа
    expect(result).toEqual(mockBody) // Проверяем данные
  })

  it('handles error response', async () => {
    const mockResponse = new Response(null, {status: 404})

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    await expect(
      request({
        url: MOCK_URL,
        options: {method: 'GET'},
      }),
    ).rejects.toEqual([mockResponse, undefined])
  })

  it('handles errors from custom handlers response', async () => {
    const mockResponse = new Response(null, {status: 404})

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    await expect(
      request({
        url: MOCK_URL,
        options: {method: 'GET'},
        errorHandlers: {
          404: () => {
            throw new Error('custom error')
          },
        },
      }),
    ).rejects.toThrowError('custom error')
  })

  it('handle request exchange', async () => {
    const mockBody = {data: 'success'}

    const mockResponse = new Response(JSON.stringify(mockBody), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    })

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const requestExchange: RequestExchange = (init) => {
      return {
        ...init,
        headers: {
          authorization: 'token',
        },
      }
    }

    const [response, result] = await request({
      url: MOCK_URL,
      exchanges: {
        request: [requestExchange],
      },
      options: {
        method: 'GET',
        headers: {
          ...mockResponse.headers,
        },
      },
    })

    expect(fetch).toHaveBeenCalledWith(MOCK_URL, {
      method: 'GET',
      headers: {
        authorization: 'token',
      },
    })
    expect(response.ok).toBe(true) // Проверяем ключевые свойства ответа
    expect(result).toEqual(mockBody) // Проверяем данные
  })

  it('handle request with async exchange', async () => {
    const mockBody = {data: 'success'}

    const mockResponse = new Response(JSON.stringify(mockBody), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    })

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const requestExchange: RequestExchange = async (req) => {
      return {
        ...req,
        headers: {
          async_authorization: 'token',
        },
      }
    }

    const [response, result] = await request({
      url: MOCK_URL,
      exchanges: {
        request: [requestExchange],
      },
      options: {
        method: 'GET',
        headers: {
          ...mockResponse.headers,
        },
      },
    })

    expect(fetch).toHaveBeenCalledWith(MOCK_URL, {
      method: 'GET',
      headers: {
        async_authorization: 'token',
      },
    })
    expect(response.ok).toBe(true) // Проверяем ключевые свойства ответа
    expect(result).toEqual(mockBody) // Проверяем данные
  })

  it('handle response exchange', async () => {
    const mockBody = {data: 'success'}

    const mockResponse = new Response(JSON.stringify(mockBody), {
      status: 200,
      headers: {'Content-Type': 'application/json'},
    })

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const responseExchange: ResponseExchange = ([response]) => {
      return [response, 'test']
    }

    const [response, result] = await request({
      url: MOCK_URL,
      exchanges: {
        response: [responseExchange],
      },
      options: {
        method: 'GET',
        headers: {
          ...mockResponse.headers,
        },
      },
    })

    expect(response.ok).toBe(true) // Проверяем ключевые свойства ответа
    expect(result).toEqual('test') // Проверяем данные
  })
})
