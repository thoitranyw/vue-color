import { mount, shallow } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'

import Hue from '../Hue'

describe('Hue.vue', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Hue)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    const wrapper = shallow(Hue)
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })
})
