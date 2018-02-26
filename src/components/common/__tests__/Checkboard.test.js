import { shallow } from 'vue-test-utils'
import { createRenderer } from 'vue-server-renderer'
// import randomInt from 'random-int'

import Checkboard from '../Checkboard'

describe('Checkboard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(Checkboard)
  })

  test('renders correctly', () => {
    const renderer = createRenderer()
    renderer.renderToString(wrapper.vm, (err, str) => {
      if (err) throw new Error(err)
      expect(str).toMatchSnapshot()
    })
  })
})
