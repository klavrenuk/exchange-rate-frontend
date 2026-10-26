import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Antd from 'ant-design-vue'
import { Dashboard } from '@/widgets/dashboard'

vi.mock('@/entities/jobs', () => ({
  getOverview: vi.fn().mockResolvedValue({ currencies: 10, rates: 20, charts_total: 5, charts_sent: 1 }),
  getJobs: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/entities/rates', () => ({
  getRates: vi.fn().mockResolvedValue([]),
}))

vi.mock('@/entities/charts', () => ({
  getCharts: vi.fn().mockResolvedValue([]),
}))

describe('Dashboard', () => {
  it('renders header', async () => {
    const wrapper = mount(Dashboard, { shallow: false, global: { plugins: [Antd] } })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Exchange Rate Service')
  })
})
