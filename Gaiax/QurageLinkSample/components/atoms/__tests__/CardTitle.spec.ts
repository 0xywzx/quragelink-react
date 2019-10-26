import { shallowMount } from '@vue/test-utils'
import CardTitle from '~/components/atoms/CardTitle.vue'

describe('CardTitle.vue', () => {
  it('should to match snapshot', () => {
    const title = 'title text'
    const wrapper = shallowMount(CardTitle, {
      slots: {
        default: title
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
