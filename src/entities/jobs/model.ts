export interface Overview {
  currencies: number
  rates: number
  charts_total: number
  charts_sent: number
  recent_jobs?: JobItem[]
}

export interface JobItem {
  id: number
  job_name: string
  status: string
  started_at: string | null
  finished_at: string | null
  duration_ms: number | null
  details_json?: string | null
  error_text?: string | null
}
