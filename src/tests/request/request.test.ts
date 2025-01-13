import {request} from '@rest/request'

global.fetch = jest.fn()

describe('request', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles successful response', async () => {
    const mockedResponseData = {
      status: 200,
      body: {data: 'success'},
    }

    const mockedRequestData = {
      url: new URL('https://example.com/api'),
      method: 'GET',
      headers: new Headers([['Content-Type', 'application/json']]),
    }

    const mockResponse = new Response(JSON.stringify(mockedResponseData.body), {
      status: mockedResponseData.status,
      headers: mockedRequestData.headers,
    })

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const [response, body] = await request({
      url: mockedRequestData.url,
      options: {method: mockedRequestData.method},
    })

    expect(fetch).toHaveBeenCalledWith(mockedRequestData.url, {
      method: mockedRequestData.method,
    })

    expect(response.status).toBe(mockedResponseData.status)
    expect(response.ok).toBe(true)
    expect(body).toEqual(mockedResponseData.body)
  })

  it('handles error response', async () => {
    const mockedRequestData = {
      url: new URL('https://example.com/api'),
      method: 'GET',
    }
    const mockResponse = new Response(null, {status: 404})

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    await expect(
      request({
        url: mockedRequestData.url,
        options: {method: mockedRequestData.method},
      }),
    ).rejects.toEqual([mockResponse, undefined])
  })

  it('handles custom error response', async () => {
    const mockedResponseData = {
      status: 404,
      body: {error: 'not found'},
    }

    const mockedRequestData = {
      url: new URL('https://example.com/api'),
      method: 'GET',
      headers: new Headers([['Content-Type', 'application/json']]),
    }

    const mockResponse = new Response(JSON.stringify(mockedResponseData.body), {
      status: mockedResponseData.status,
      headers: mockedRequestData.headers,
    })

    ;(fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

    await expect(
      request({
        url: new URL(mockedRequestData.url),
        options: {method: mockedRequestData.method},
        errorHandlers: {
          [404]: () => {
            throw new Error(mockedResponseData.body.error)
          },
        },
      }),
    ).rejects.toThrowError(mockedResponseData.body.error)
  })
})
