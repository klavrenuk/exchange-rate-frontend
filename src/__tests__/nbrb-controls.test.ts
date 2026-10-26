import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Antd from 'ant-design-vue'
import { NbrbControls } from '@/features/nbrb-controls'

describe('NbrbControls', () => {
  it('renders buttons', () => {
    const wrapper = mount(NbrbControls, { global: { plugins: [Antd] } })
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})
