import { mount } from 'vue-test-utils'
import Slider from '../Slider'

describe('Slider', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Slider)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
