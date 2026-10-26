import axios from 'axios'
import { API_BASE_URL } from '@/shared/config'
import { toApiError } from './errors'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
})

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
)
