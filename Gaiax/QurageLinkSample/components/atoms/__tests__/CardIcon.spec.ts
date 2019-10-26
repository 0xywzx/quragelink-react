import { shallowMount } from '@vue/test-utils'
import CardIcon from '~/components/atoms/CardIcon.vue'

describe('CardIcon.vue', () => {
  it('should to match snapshot', () => {
    const wrapper = shallowMount(CardIcon)
    expect(wrapper.element).toMatchSnapshot()
  })
})
