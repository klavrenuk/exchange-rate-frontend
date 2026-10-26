import axios from 'axios'

interface ErrorPayload {
  detail?: unknown
  message?: unknown
}

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function extractValidationMessage(detail: unknown[]): string | null {
  const messages = detail
    .map((item) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'msg' in item) {
        return String((item as { msg: unknown }).msg)
      }
      return null
    })
    .filter((item): item is string => Boolean(item && item.trim()))

  return messages.length ? messages.join('; ') : null
}

function extractDetail(data: unknown, status: number): string | null {
  if (typeof data === 'string') {
    const text = data.trim()
    const isPlainText = text.length > 0 && text.length < 300 && !text.startsWith('<')
    return isPlainText && status < 500 ? text : null
  }

  if (!data || typeof data !== 'object') return null

  const payload = data as ErrorPayload

  if (typeof payload.detail === 'string' && payload.detail.trim()) {
    return payload.detail.trim()
  }

  if (Array.isArray(payload.detail)) {
    return extractValidationMessage(payload.detail)
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message.trim()
  }

  return null
}

function statusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Неверный запрос'
    case 401:
      return 'Требуется авторизация'
    case 403:
      return 'Доступ запрещён'
    case 404:
      return 'Запрошенный ресурс не найден'
    case 409:
      return 'Конфликт данных, обновите страницу'
    case 422:
      return 'Некорректные данные запроса'
    case 429:
      return 'Слишком много запросов, попробуйте позже'
    case 500:
      return 'Внутренняя ошибка сервера'
    case 502:
      return 'Сервер временно недоступен'
    case 503:
      return 'Сервис временно недоступен'
    default:
      return `Ошибка сервера (${status})`
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError('Сервер не ответил вовремя. Попробуйте ещё раз.')
    }

    if (!error.response) {
      return new ApiError('Нет связи с сервером. Проверьте, что бэкенд запущен, и повторите попытку.')
    }

    const { status, data } = error.response
    const detail = extractDetail(data, status)

    return new ApiError(detail || statusMessage(status), status)
  }

  if (error instanceof Error && error.message) {
    return new ApiError(error.message)
  }

  return new ApiError('Неизвестная ошибка')
}

export function getErrorMessage(error: unknown, fallback = 'Не удалось выполнить запрос'): string {
  if (axios.isAxiosError(error) || error instanceof ApiError) {
    return toApiError(error).message || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
