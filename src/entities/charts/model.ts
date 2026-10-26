export interface ChartItem {
  id: number
  url: string
  slug: string
  title: string
  discovered_at: string | null
  downloaded_at: string | null
  has_files: boolean
  local_path: string | null
  sent: boolean
  images?: string[]
}
