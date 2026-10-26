import { AxiosError } from 'axios'
import type { AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { ApiError, getErrorMessage, toApiError } from '@/shared/api/errors'

function responseError(status: number, data: unknown) {
  const response = {
    data,
    status,
    statusText: '',
    headers: {},
    config: {},
  } as unknown as AxiosResponse

  return new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, response)
}

describe('toApiError', () => {
  it('uses FastAPI detail', () => {
    expect(toApiError(responseError(500, { detail: 'SMTP authentication failed' })).message).toBe(
      'SMTP authentication failed',
    )
  })

  it('joins validation errors', () => {
    const error = responseError(422, {
      detail: [{ msg: 'field required' }, { msg: 'invalid value' }],
    })

    expect(toApiError(error).message).toBe('field required; invalid value')
  })

  it('hides plain text error for 5xx responses', () => {
    expect(toApiError(responseError(500, 'Internal Server Error')).message).toBe(
      'Внутренняя ошибка сервера',
    )
  })

  it('reports missing connection', () => {
    const error = new AxiosError('Network Error', 'ERR_NETWORK')

    expect(toApiError(error).message).toContain('Нет связи с сервером')
  })

  it('reports timeout', () => {
    const error = new AxiosError('timeout', 'ECONNABORTED')

    expect(toApiError(error).message).toContain('не ответил вовремя')
  })

  it('keeps ApiError unchanged', () => {
    const error = new ApiError('Готово', 400)

    expect(toApiError(error)).toBe(error)
  })
})

describe('getErrorMessage', () => {
  it('returns fallback for unknown error', () => {
    expect(getErrorMessage(null, 'Не удалось загрузить данные')).toBe('Не удалось загрузить данные')
  })

  it('returns message of regular error', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom')
  })
})
