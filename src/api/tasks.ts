import { api } from './client'

export async function runAll() {
  const res = await api.post('/tasks/run-all')
  return res.data
}
