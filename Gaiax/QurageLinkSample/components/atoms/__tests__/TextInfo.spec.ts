import { shallowMount } from '@vue/test-utils'
import TextInfo from '~/components/atoms/TextInfo.vue'

describe('TextInfo.vue', () => {
  it('should to match snapshot', () => {
    const text = 'test text'
    const wrapper = shallowMount(TextInfo, {
      slots: {
        default: text
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
