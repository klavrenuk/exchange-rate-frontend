import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Antd from 'ant-design-vue'
import { IeaControls } from '@/features/iea-controls'

describe('IeaControls', () => {
  it('renders buttons', () => {
    const wrapper = mount(IeaControls, { global: { plugins: [Antd] } })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(4)
  })
})
