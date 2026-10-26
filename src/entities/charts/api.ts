import { api } from '@/shared/api'

export async function discoverCharts() {
  const res = await api.post('/iea/discover')
  return res.data
}

export async function downloadNewCharts() {
  const res = await api.post('/iea/download-new')
  return res.data
}

export async function sendNewCharts() {
  const res = await api.post('/iea/send-new')
  return res.data
}

export async function getCharts() {
  const res = await api.get('/iea/charts')
  return res.data
}
