import {request} from '@rest/request/index'

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
})
