import { api } from '@/shared/api'

export async function getOverview() {
  const res = await api.get('/status/overview')
  return res.data
}

export async function getJobs(limit = 50) {
  const res = await api.get(`/status/jobs?limit=${limit}`)
  return res.data
}
