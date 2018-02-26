import { shallow } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'

import Alpha from '../Alpha'

describe('Checkboard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Alpha)
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })
})
