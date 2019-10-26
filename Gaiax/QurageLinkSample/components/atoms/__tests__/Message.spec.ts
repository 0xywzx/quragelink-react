import { shallowMount } from '@vue/test-utils'
import Message from '~/components/atoms/Message.vue'

describe('Message.vue', () => {
  it('should to match snapshot', () => {
    const wrapper = shallowMount(Message, {
      propsData: {
        data: { sender: '0x5c0bA9fC40f672932FaC478ca8B69d855C922675', contents: 'Hello, World!' }
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
