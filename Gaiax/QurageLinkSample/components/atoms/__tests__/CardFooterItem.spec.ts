import { Vue } from 'nuxt-property-decorator'
import { shallowMount, Wrapper } from '@vue/test-utils'
import CardFooterItem from '~/components/atoms/CardFooterItem.vue'

describe('CardFooterItem.vue', () => {
  const slotContent = 'test content'

  let wrapper: Wrapper<Vue>
  beforeEach(() => {
    wrapper = shallowMount(CardFooterItem, {
      slots: {
        default: slotContent
      }
    })
  })

  it('should to match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should emit event click when pushed link', () => {
    wrapper.find('a').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
