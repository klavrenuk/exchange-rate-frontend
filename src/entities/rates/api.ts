import { api } from '@/shared/api'

export async function getRates(ondate?: string) {
  const res = await api.get('/nbrb/rates', { params: ondate ? { ondate } : {} })
  return res.data
}

export async function syncCurrencies() {
  const res = await api.post('/nbrb/sync-currencies')
  return res.data
}

export async function loadHistory(params: { cur_abbr?: string; from_date?: string; to_date?: string } = {}) {
  const res = await api.post('/nbrb/load-history', null, { params })
  return res.data
}

export async function updateToday(periodicity = 0) {
  const res = await api.post(`/nbrb/update-today?periodicity=${periodicity}`)
  return res.data
}

export async function reportAndSend() {
  const res = await api.post('/nbrb/report-and-send')
  return res.data
}
