import { shallowMount } from '@vue/test-utils'
import QRCode from '~/components/atoms/QRCode.vue'

describe('QRCode.vue', () => {
  it('should to match snapshot', () => {
    const data = 'test data'
    const wrapper = shallowMount(QRCode, {
      propsData: {
        data: data
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
