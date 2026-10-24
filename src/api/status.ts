import { api } from './client'

export async function getHealth() {
  const res = await api.get('/health')
  return res.data
}

export async function getOverview() {
  const res = await api.get('/status/overview')
  return res.data
}

export async function getJobs(limit = 50) {
  const res = await api.get(`/status/jobs?limit=${limit}`)
  return res.data
}
